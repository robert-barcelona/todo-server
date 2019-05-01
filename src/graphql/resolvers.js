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
      const todo = await prisma.updateToDo({where: {id}, data})
      return todo
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
      return prisma.user({id: user.id})
    },
    getTodos: async (parent, args, {user, prisma}, info) => {
      if (!user) throw new Error('Not authenticated')
      const filterID = user.id
      return prisma.toDoes({where: {user: {id:filterID}}})
    },
  },

  ToDo: {
    user: async (parent, args, {prisma}) => {
      return prisma.toDo({id:parent.id}).user()
    }
  }
}


module.exports = resolvers
