const mongoose = require('mongoose');
import { User } from './user';
const ConversationSchema = mongoose.Schema({
    participants: {
        type: [User]
    }   
  });
const Conversation = module.exports = mongoose.model('Conversation', ConversationSchema);
let newConv = new Conversation({
    participants: [
        {
            name: "Prince",
            email: "Testing@a.com"
        }
    ]
});
newConv.create((err, conv) => {
    if (err) {
        console.log('error');
    } else {
        console.log(conv);
    }
});