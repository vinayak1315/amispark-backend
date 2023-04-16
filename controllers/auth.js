const ErrorHandler = require("../utils/errorHandler")
const Registration = require('../models/user')
const Organiser = require('../models/admin')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const Events = require('../models/event')

exports.userRegister = async (req, res, next) => {
    try {
        let { name, email, events, phone, branch, semester, gender, amount } = req.body;

        if (name == "" || email == "" || events == [] || phone == "" || amount == "") {
            return next(new ErrorHandler('Please Provide Valid Details', 404));
        }

        const register = await Registration.create({
            name,
            email,
            gender,
            branch,
            semester,
            events,
            phone,
            amount
        })

        res.status(200).json({
            success: true,
            data: register
        })
    } catch (err) {
        return next(new ErrorHandler(err.message, 500))
    }
}

exports.getRegisteredUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        let count;
        let userData = []
        const user = await Registration.find()
        const organiser = req.user

        if (organiser.role == "organiser") {
            const eventList = await Events.findOne({ organiserEmail: organiser.email, eventId: id })

            if (eventList) {
                user.map((val) => {
                    val.events.map((eventId) => {
                        if (eventId == id) {
                            userData.push(val)
                        }
                    })
                })
            } else {
                return next(new ErrorHandler("Oops! Event is not in your bucket", 404))
            }
        }
        if (organiser.role == "admin") {
            user.map((val) => {
                val.events.map((eventId) => {
                    if (eventId == id) {
                        userData.push(val)
                    }
                })
            })
        }
        res.status(200).json({
            success: true,
            data: userData,
            count: userData.length
        })
    } catch (err) {
        return next(new ErrorHandler(err.message, 500))
    }
}

exports.addOrganiser = async (req, res, next) => {
    try {
        let { name, email, password, phone, branch, semester } = req.body;

        if (name == "" || email == "" || password == "" || phone == "") {
            return next(new ErrorHandler('Please Provide Valid Details', 403));
        }

        password = await bcrypt.hash(password, 10)

        const checkUser = await Organiser.findOne({ email: email, phone: phone });
        if (checkUser) {
            return next(new ErrorHandler("User Already Exist with this phone number and email", 403))
        }


        const user = await Organiser.create({
            name,
            email,
            password,
            branch,
            semester,
            phone
        })

        res.status(200).json({
            success: true,
            data: user
        })


    } catch (err) {
        return next(new ErrorHandler(err.message, 500))
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(404).json({ error: "Please enter email or password" })
        }
        const organiser = await Organiser.findOne({ email })

        if (!organiser) {
            return next(new ErrorHandler("You don't have access", 403))
        }
        const checkPassword = await bcrypt.compare(password, organiser.password)

        if (checkPassword) {
            const token = await jwt.sign({ id: organiser._id }, process.env.jwtSecret, {
                expiresIn: process.env.jwtExpireTime
            })
            res.status(200).cookie("token", token, { httpOnly: true }).json({
                success: true,
                message: "Login Successfully"
            })
        } else {
            return next(new ErrorHandler("Please enter valid email and password", 403))
        }
    } catch (err) {
        return next(new ErrorHandler(err.message, 403))
    }


}

exports.logout = async (req, res, next) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now())
        })
        res.status(200).json({
            success: true,
            message: 'Logged out'
        })
    } catch (err) {
        return next(new ErrorHandler(err.message, 500))
    }
}

exports.updateOrganiser = async (req, res, next) => {
    try {
        let id = req.params.id
        const user = await Organiser.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).json({
            success: true,
            data: user
        })
    } catch (err) {
        return next(new ErrorHandler(err.message, 500))
    }
}

exports.deleteOrganiser = async (req, res, next) => {
    try {
        const id = req.params.id
        const deleteUser = await Organiser.findByIdAndDelete(id);
        if (!deleteUser) {
            return next(new ErrorHandler("User Not exist", 500))
        }
        res.status(200).json({
            success: true,
            data: deleteUser,
            message: "User Deleted Successfully"
        })
    } catch (err) {
        return next(new ErrorHandler(err.message, 500))
    }
}

exports.getOrganiser = async (req, res, next) => {
    try {
        const organiser = await Organiser.find();
        res.status(200).json({
            success: true,
            data: organiser
        })
    } catch (err) {
        return next(new ErrorHandler(err.message, 500))
    }
}