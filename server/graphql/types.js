const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} = require('graphql');

const models = require('../models');

const comment = new GraphQLObjectType({
    name: 'comment',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
        replies: {
            type: new GraphQLList(comment)
        },
        likes: {
            type: GraphQLInt
        }
    })
})

const citation = new GraphQLObjectType({
    name: 'citation',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        text: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
        link: {
            type: GraphQLString
        }
    })
});

const remark = new GraphQLObjectType({
    name: 'remark',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
        comments: {
            type: new GraphQLList(comment)
        },
        quote: {
            type: remark
        },
        citations: {
            type: new GraphQLList(citation)
        },
        likes: {
            type: GraphQLInt
        }
    })
})

const conversation = new GraphQLObjectType({
    name: 'conversation',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        participants: {
            type: new GraphQLList(user)
        },
        title: {
            type: GraphQLString
        },
        remarks: {
            type: new GraphQLList(remark),
            resolve: async conversation => (await models.Conversation.findById(conversation.id))
            .populate('remarks')
            .remarks
        }
    })
});

const user = new GraphQLObjectType({
    name: 'user',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        username: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        bio: {
            type: GraphQLString
        },
        friends: {
            type: new GraphQLList(user),
            resolve: async user => (await models.User.findById(user._id)
            .populate('friends'))
            .friends
        },
        conversations: {
            type: new GraphQLList(conversation)
        }
    })
});

module.exports = {
    user, conversation, remark
}