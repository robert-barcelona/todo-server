const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const resolvers = {
  Mutation: {

    addTodo: async (parent, {body, title = '', completed = false}, {user, prisma}) => {
      if (!user) throw new Error('Not authenticated')
      const username = user.username
      console.log(username)
      return await prisma.createToDo({body, title, user: {connect: {username}}, completed})

    },
    setTodoComplete: async (parent, {id, completed}, {user, prisma}) => {
      if (!user) throw new Error('Not authenticated')
      return await prisma.updateToDo({
        data: {
          completed
        },
        where: {
          id,
        },
      })

    },
    deleteTodo: async (parent, {id}, {user, prisma}) => {
      if (!user) throw new Error('Not authenticated')
      return await prisma.deleteToDo({id})
    },

    updateTodo: async (parent, {body, title, completed, id}, {user, prisma}) => {
      if (!user) throw new Error('Not authenticated')
      const data = Object.assign({}, {body, title, completed})
      return await prisma.updateToDo({where: {id}, data})
    },

    register: async (parent, {username, password}, ctx, info) => {
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await ctx.prisma.createUser({
        username,
        password: hashedPassword,
      })
      return user
    },
    login: async (parent, {username, password}, ctx, info) => {
      const user = await ctx.prisma.user({username})

      if (!user) throw new Error(`User ${username} does not exist`)
      console.log(process.env.SECRET_STUFF)

      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) throw new Error('Invalid password')

      const token = jwt.sign({
          username,
          id: user.id
        },
        process.env.SECRET_STUFF,
        {
          expiresIn: '30d', // token will expire in 30days
        }
      )

      return {token, user}
    }
  },
  Query: {
    currentUser: async (parent, args, {user, prisma}, info) => {
      if (!user) throw new Error('Not authenticated')
      return await prisma.user({id: user.id})
    },
    getTodos: async (parent, args, {user, prisma}, info) => {
      if (!user) throw new Error('Not authenticated')
      const filterID = user.id
      return await prisma.toDoes({where: {user: {id:filterID}}})
    },
    getTodosFiltered: async (parent, {showIncompleteOnly,filterText}, {user, prisma}, info) => {
      if (!user) throw new Error('Not authenticated')
      const filterID = user.id

      const completedFilter = showIncompleteOnly ? {completed:false} : {}

      const where = filterText ? {

        AND: [{user: {id:filterID}},
          {
            AND: [
              {
                OR: [
                  { title_contains: filterText },
                  { body_contains: filterText },
                ]
              },
              completedFilter
            ]
          }
        ]

      } : {AND: [{user: {id:filterID}},completedFilter]}
      const todos = await prisma.toDoes({where})
      console.log(todos)
      return todos
    },
  },

  ToDo: {
    user: async (parent, args, {prisma}) => {
      return await prisma.toDo({id:parent.id}).user()
    }
  }
}


module.exports = resolvers
