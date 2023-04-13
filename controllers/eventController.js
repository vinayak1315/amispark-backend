const ErrorHandler = require("../utils/errorHandler")
const Events = require('../models/event');
const Admin = require('../models/admin');

exports.addEvents = async (req, res, next) => {
    try {
        let { title, phone, description, studentCordinator, facultyCordinator, price, status, organiserEmail, image } = req.body;
        //Check ?
        if (title == "" || phone == "" || description == "" || studentCordinator == [] || facultyCordinator == [] || status == "") {
            return next(new ErrorHandler('Please Provide Valid Details', 403));
        }

        const organiser = req.user;

        if (organiser.role == 'admin') {
            if (organiserEmail == "") {
                return next(new ErrorHandler('Please provide organiser email', 400))
            }
            const organiserData = await Admin.findOne({ email: organiserEmail });
            if (!organiserData) {
                return next(new ErrorHandler('Please provide valid organiser email id', 400))
            }
        }

        if (organiser.role == 'organiser') {
            organiserEmail = organiser.email;
        }
        
        let eventId = 1
        const eventData = await Events.find();

        if(eventData.length == 0) {
            eventId = 1
        } else {
            eventId = eventId + eventData.length
        }
      
        
        const event = await Events.create({
            eventId,
            title,
            phone,
            description,
            studentCordinator,
            facultyCordinator,
            price,
            organiserEmail,
            image
        })
        
        res.status(200).json({
            success: true,
            message: "Event register Successfully",
            data: event
        })
    } catch (err) {
        return next(new ErrorHandler(err.message, 500))
    }
}

exports.updateEvent = async (req, res, next) => {
    try {
        let eventId = req.params.id
        const event = await Events.findByIdAndUpdate(eventId, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).json({
            success: true,
            data: event
        })
    } catch (err) {
        return next(new ErrorHandler(err.message, 500))
    }
}

exports.getAllEvents = async (req, res, next) => {
    try {
        let { page, limit } = req.query;
        const eventData = await Events.find().limit(limit).skip((page -1) * limit)

        res.status(200).json({
            success: true,
            data: eventData
        })

    } catch (err) {
        return next(new ErrorHandler(err.message, 500))
    }
}

exports.deleteEvents = async (req, res, next) => {
    try {
        const eventId = req.params.id
        const deleteEvent = await Events.findByIdAndDelete(eventId)
        if (!deleteEvent) {
            return next(new ErrorHandler(`Event not found with this id: ${req.params.id}`));
        }
        res.status(200).json({
            success: true,
            data: deleteEvent,
            message: "Event deleted successfully"
        })

    } catch (err) {
        return next(new ErrorHandler(err.message, 500))
    }
}

exports.getSingleEvents = async (req, res, next) => {
    try {
        const eventId = req.params.id;
        const singleEvent = await Events.findById(eventId);
        if (!singleEvent) {
            return next(new ErrorHandler(`Event not found with this id: ${req.params.id}`));
        }
        res.status(200).json({
            success: true,
            data: singleEvent
        })
    } catch (err) {
        return next(new ErrorHandler(err.message, 500))
    }
}

exports.getOrganiserEvents = async (req, res, next) => {
    try {
        const userChecker = req.user;
        let { organiserEmail } = req.query

        if(userChecker.role == 'organiser') {
            organiserEmail = userChecker.email
        }
        if(userChecker.role == 'admin') {
            if (organiserEmail == "") {
                return next(new ErrorHandler('Please provide organiser email', 400))
            }
            const organiserData = await Admin.findOne({ email: organiserEmail });
            if (!organiserData) {
                return next(new ErrorHandler('Please provide valid organiser email id', 400))
            }
        }
        const event = await Events.find({organiserEmail: organiserEmail});
        if (!event) {
            return next(new ErrorHandler(`Event not found with this id: ${req.params.id}`));
        }
        res.status(200).json({
            success: true,
            data: event
        })
    } catch (err) {
        return next(new ErrorHandler(err.message, 500))
    }
}

