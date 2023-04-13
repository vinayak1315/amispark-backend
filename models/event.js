const mongoose = require('mongoose');
const isEmail = require ( 'validator/lib/isEmail')

const Events = new mongoose.Schema({
    eventId: {
        type: Number,
        default: 1
    },
    organiserEmail: {
        type: String,
        validate: [isEmail,'Invalid email address'],
    },
    image: {
        type: String,
        required : true
    },
    title: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    description: {
        type: String,
        maxLength: 370,
        required: true
    },
    studentCordinator: {
        type: Array,
        required: true
    },
    facultyCordinator: {
        type: Object, 
        required: true
    },
    price:{   
        type:Number,      
        required: true
    },
    status:{
        type: String,
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('event', Events);