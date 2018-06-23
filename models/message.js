const mongoose = require('mongoose');
const MessageSchema = mongoose.Schema({
    from: {
        type: {
            id: string,
            name: string,
            email: string
        },
        required: true
    },
    text: {
        type: string,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
  });
  const Message = module.exports = mongoose.model('Message', MessageSchema);