const mongoose = require('mongoose');
const isEmail = require ( 'validator/lib/isEmail')
var AutoIncrement = require('mongoose-sequence')(mongoose)

const Events = new mongoose.Schema({
    eventId: {
        type: Number,
    },
    organiserEmail: {
        type: String,
        validate: [isEmail,'Invalid email address'],
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

Events.plugin(AutoIncrement, { id: 'status_seq', inc_field: 'eventId' })
Events.set('collection', 'Event')

module.exports = mongoose.model('Event', Events);