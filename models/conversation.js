const mongoose = require('mongoose');
const ConvUser = {
    id: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    }
}
const ConversationSchema = mongoose.Schema({
    participants: {
        type: [ConvUser]
    }   
  });
const Conversation = module.exports = mongoose.model('Conversation', ConversationSchema);
module.exports.addConv = (newConv, callback) => {
    newConv.save(callback);
}
