const express = require('express')
require('dotenv').config();

const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

const app = express()

//Connect to database
connectDB()

//if don't have it, it will have an error
app.use(cors())

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: process.env.NODE_ENV === 'development'
}))

app.listen(port, console.log(`Server running on port ${port}`))