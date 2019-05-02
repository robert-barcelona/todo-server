const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
var cors = require('cors');

const jwt = require('jsonwebtoken')
require('dotenv').config()

const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')
const {prisma} = require('../generated/prisma-client/index.js');

const getUser = token => {
  console.log('getUser',token)
  try {
    if (token) {
    //  return jwt.verify(token, process.env.SECRET_STUFF)
      return jwt.verify(token, 'xyyzy') // to avoid creating .env for demo
    }
    return null
  } catch (err) {
    return null
  }
}


const server = new ApolloServer({
  typeDefs, resolvers,

  context: ({req}) => {
    const tokenWithBearer = req.headers.authorization || ''
    const token = tokenWithBearer.split(' ')[1]
    const user = getUser(token)
    return {
      user,
      prisma
    }
  },
  debug: true,
});

const app = express();
app.use(cors());


server.applyMiddleware({app});

app.listen({port: 4000}, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);
