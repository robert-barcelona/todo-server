# Todomania Server

A sample todo client server based on Apollo Server and Prisma GraphQL.  Serves data in response to GraphQL queries.  

## Installing

After downloading the GIT repo, run

`yarn`

then 

`cd src`

then 

`node index.js` 

The server will be accessible on 

`http://localhost:4000/graphql`


### About The Server

This server handles authentication using JSON web tokens.  Prisma is used as the ORM and the database is located at https://eu1.prisma.sh/robertanthonydeveloper/todoprisma/dev




## Built With

Principal components

* [Apollo Server Express](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-express) - The Apollo Server
* [Prisma GraphQL](https://www.prisma.io/) - An ORM to access the database and to convert data to GraphQL
* [JSON Web Token](https://jwt.io/) - For authentication
* [Bcrypt](https://www.npmjs.com/package/bcrypt) - For hashing passwords


## Note

In order to keep things simple for those downloading this from GitHub, references to the secret key for encrpyting JSON web tokens is hardcoded.  This may be replaced in the appropriate places by accessing the value in the included `.env` file if desired.
