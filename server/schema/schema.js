
//Mongoose models
const Project = require('../models/Project')
const Client = require('../models/Client')

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require('graphql')

// Project Type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve (parent, args) {
        return Client.findById(parent.clientId)
      },
    },
  }),
})

// Client Type
const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    address: { type: GraphQLString },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve (parent, args) {
        return Project.find()
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve (parent, args) {
        return Project.findById(args.id)
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve (parent, args) {
        return Client.find()
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve (parent, args) {
        console.log(args)
        return Client.find(args.id)
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  // mutation,
})