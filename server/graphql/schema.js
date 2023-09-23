const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLBoolean
} = require('graphql')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const models = require('../models');
const types = require('./types');

const compareHashedPassword = (clearTextPassword, user) => bcrypt.compareSync(clearTextPassword, user.password);

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
        },
        login: {
            type: GraphQLString,
            args: {
                username: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { 
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (_, { username, email, password }) => {
                let user = await models.User.findOne({ username });

                if (!user) {
                    user = await models.User.findOne({ email });
                }
                if (!user) {
                    throw new Error("Invalid username/email");
                }

                if (!compareHashedPassword(password, user)) {
                    throw new Error("Incorrect password");
                }

                return jwt.sign({ userId: user._id}, process.env.JWT_SECRET);
            }
        },
        authorize: {
            type: GraphQLString,
            args: {
                token: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (_, { token }) => jwt.verify(token, process.env.JWT_SECRET).userId
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
        updateBio: {
            type: types.user,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                bio: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (_, { id, bio }) => {
                const user = await models.User.findById(id);
                
                user.bio = bio;
                await user.save();

                return user;
            }
        },
        addFriendRequest: {
            type: new GraphQLList(types.user),
            args: {
                userId: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                friendId: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (_, { userId, friendId }) => {
                const user = await models.User.findById(userId);
                const friend = await models.User.findById(friendId);

                friend.incomingFriendRequests.push(userId);
                user.outgoingFriendRequests.push(friendId);
                await friend.save();
                await user.save();

                return [user, friend];
            }
        },
        removeFriendRequest: {
            type: new GraphQLList(types.user),
            args: {
                userId: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                friendId: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (_, { userId, friendId }) => {
                const user = await models.User.findById(userId);
                const friend = await models.User.findById(friendId);

                user.outgoingFriendRequests.pull(new mongoose.Types.ObjectId(friendId));
                friend.incomingFriendRequests.pull(new mongoose.Types.ObjectId(userId));
                await user.save();
                await friend.save();

                return [user, friend];
            }
        },
        addFriend: {
            type: new GraphQLList(types.user),
            args: {
                userId: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                friendId: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (_, { userId, friendId }) => {
                const user = await models.User.findById(userId);
                const friend = await models.User.findById(friendId);

                user.friends.push(friendId);
                friend.friends.push(userId);

                user.incomingFriendRequests.pull(new mongoose.Types.ObjectId(friendId));
                user.outgoingFriendRequests.pull(new mongoose.Types.ObjectId(friendId));
                friend.incomingFriendRequests.pull(new mongoose.Types.ObjectId(userId));
                friend.outgoingFriendRequests.pull(new mongoose.Types.ObjectId(userId));
                
                await user.save();
                await friend.save();

                return [user, friend];
            }
        },
        removeFriend: {
            type: new GraphQLList(types.user),
                args: {
                    userId: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    friendId: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
            resolve: async (_, { userId, friendId }) => {
                const user = await models.User.findById(userId);
                const friend = await models.User.findById(friendId);

                user.friends.pull(friendId);
                friend.friends.pull(userId);
                await user.save();
                await friend.save();

                return [user, friend];
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
        addUsersToConversation: {
            type: types.conversation,
            args: {
                conversationId: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                userIds: {
                    type: new GraphQLNonNull(new GraphQLList(GraphQLString))
                }
            },
            resolve: async (_, { conversationId, userIds }) => {
                const conversation = await models.Conversation.findById(conversationId);
                const users = [];

                for (let id of userIds) {
                    conversation.participants.addToSet(new mongoose.Types.ObjectId(id))
                    users.push(await models.User.findById(id))
                }
                await conversation.save();

                for (let user of users) {
                    user.conversations.addToSet(conversation._id);
                    await user.save();
                }

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