const { gql } = require('apollo-server-express/dist/index');


const typeDefs = gql`

  scalar DateTime


  type User {
    id: ID!
    username: String!
    password: String!
  }

  type Query {
    currentUser: User!
    getTodos: [ToDo]!
    getTodosFiltered(showIncompleteOnly: Boolean!, filterText:String):[ToDo]!
  }

  type Mutation {
    register(username: String!, password: String!): User!
    login(username: String!, password: String!): LoginResponse!
    addTodo(body: String!, title: String, completed: Boolean): ToDo!
    deleteTodo(id: ID!): ToDo
    updateTodo(id:ID!, body:String, title:String, completed:Boolean):ToDo!
    setTodoComplete(id:ID!,completed:Boolean):ToDo!
  }

  type LoginResponse {
    id: ID!
    token: String
    user: User
  }
  
 
  
  type ToDo {
    id: ID!
    title: String,
    added: String!
    body: String!
    user: User!
    completed: Boolean!
    
  }

`


  module.exports = typeDefs

