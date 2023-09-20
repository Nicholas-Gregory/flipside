const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql')
const mongoose = require('mongoose');

const models = require('../models')
const types = require('./types')

const query = new GraphQLObjectType({
    name: 'rootQuery',
    fields: () => ({
        users: {
            type: new GraphQLList(types.user),
            resolve: async () => await models.User.find({})
        },
        conversations: {
            type: new GraphQLList(types.conversation),
            resolve: async () => await models.Conversation.find({})
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
        },
        addConversation: {
            type: types.conversation,
            args: {
                title: {
                    type: GraphQLString
                },
                participantIds: {
                    type: new GraphQLList(GraphQLString)
                },
                remarkIds: {
                    type: new GraphQLList(GraphQLString)
                }
            },
            resolve: async (_, { title, participantIds, remarkIds }) => {
                const conversation = new models.Conversation({ 
                    title,
                    participants: (participantIds || [])
                    .map(id => new mongoose.Types.ObjectId(id)),
                    remarks: (remarkIds || [])
                    .map(id => new mongoose.Types.ObjectId(id))
                });
                await conversation.save();

                return conversation;
            }
        },
        addRemark: {
            type: types.remark,
            args: {
                conversationId: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                body: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                authorId: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                quotedRemarkId: { type: GraphQLString }
            },
            resolve: async (_, { conversationId, body, authorId, quotedRemarkId }) => {
                const remark = new models.Remark({ 
                    body, 
                    author: authorId,
                    conversation: conversationId,
                    quote: quotedRemarkId 
                    ? await models.Remark.findById(quotedRemarkId)
                    : null
                });
                await remark.save();
                const conversation = await models.Conversation.findById(conversationId);

                conversation.remarks.push(remark._id);
                await conversation.save();

                return remark;
            }
        },
        addCitation: {
            type: types.citation,
            args: {
                remarkId: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                text: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                body: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                link: { type: GraphQLString }
            },
            resolve: async (_, { remarkId, text, body, link }) => {
                const remark = await models.Remark.findById(remarkId);
                const citations = remark.citations;

                citations.push({
                    text,
                    body,
                    link
                });
                await remark.save();

                return citations[citations.length - 1];
            }
        },
        addComment: {
            type: types.comment,
            args: {
                remarkId: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                body: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                parentId: {
                    type: GraphQLString
                }
            },
            resolve: async (_, { remarkId, body, parentId }) => {
                const remark = await models.Remark.findById(remarkId);
                const comment = new models.Comment({
                    remark: remarkId,
                    body,
                    parent: parentId
                });
                await comment.save();
                const comments = remark.comments;

                if (parentId) {
                    const parent = await models.Comment.findById(parentId);

                    parent.replies.push(new mongoose.Types.ObjectId(comment._id));
                    await parent.save();

                    return comment;
                }

                comments.push(new mongoose.Types.ObjectId(comment._id));
                await remark.save();

                return comment;
            }
        }
    })
})

module.exports = {
    query, mutation
}