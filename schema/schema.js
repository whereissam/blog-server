const _ = require('lodash');

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
    }
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
    project: {
      type: new GraphQLList(ProjectType),
      resolve (parent, args) {
        return Project.find({ clientId: parent.id })
      },
    },
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
    clientSearchByAddress: {
      type: ClientType,
      args: { address: { type: GraphQLString } },
      resolve (parent, args) {
        return Client.findOne({ address: args.address }).exec()
      }
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve (parent, args) {
        return Client.findById(args.id)
      },
    },
  },
})

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Add a client
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        address: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve (parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          address: args.address,
        })

        return client.save()
      },
    },
    // Delete a client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve (parent, args) {
        return Client.findByIdAndRemove(args.id)
      },
    },
    // Add a project
    addProject: {
      type: ProjectType,
      args: {
        title: { type: GraphQLNonNull(GraphQLString) },
        body: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              'draft': { value: 'In Progress' },
              'completed': { value: 'Completed' },
            },
          }),
          defaultValue: 'In progress',
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
        clientAddress: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve (parent, args) {
        const project = new Project({
          title: args.title,
          body: args.body,
          status: args.status,
          clientId: args.clientId,
          clientAddress: args.clientAddress
        })

        return project.save()
      },
    },
    // Delete a project
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve (parent, args) {
        return Project.findByIdAndRemove(args.id)
      },
    },
    // Update a project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLNonNull(GraphQLString) },
        body: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatusUpdate',
            values: {
              'draft': { value: 'In Progress' },
              'completed': { value: 'Completed' },
            },
          })
        }
      },
      resolve (parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              body: args.body,
              status: args.status,
            },
          },
          { draft: true }
        )
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
})