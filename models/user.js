const mongoose = require('mongoose');

const Registeration = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    gender : {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    events: {
        type: Array,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Registeration', Registeration);