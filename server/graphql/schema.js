const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLScalarType
} = require('graphql')

const models = require('../models')
const types = require('./types')

const query = new GraphQLObjectType({
    name: 'rootQuery',
    fields: () => ({
        users: {
            type: new GraphQLList(types.user),
            resolve: async () => await models.User.find({})
        }
    })
});

const mutation = new GraphQLObjectType({
    name: 'rootMutation',
    fields: () => ({
        addUser: {
            type: types.user,
            args: {
                username: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                email: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                password: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                bio: {
                    type: GraphQLString
                }
            },
            resolve: async (_, { username, email, password, bio }) => {
                const user = new models.User({
                    username,
                    email,
                    password,
                    bio
                });
                await user.save();

                return user;
            }
        }
    })
})

module.exports = {
    query, mutation
}