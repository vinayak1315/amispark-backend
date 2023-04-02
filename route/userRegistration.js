const express = require('express');
const router = express.Router();
const { userRegister, addOrganiser, login, logout, updateOrganiser, deleteOrganiser, getOrganiser } = require('../controllers/auth')
const { isAuthenticatedUser, roleValidation } = require('../middlewares/auth')

router.get('/user/registration', isAuthenticatedUser, userRegister)
router.post('/registration/organiser', isAuthenticatedUser, roleValidation, addOrganiser)
router.get('/registration/organiser', isAuthenticatedUser, roleValidation, getOrganiser)
router.put('/registration/organiser/:id', isAuthenticatedUser, roleValidation, updateOrganiser)
router.delete('/registration/organiser/:id', isAuthenticatedUser, roleValidation, deleteOrganiser)
router.post('/login', login)
router.get('/logout', logout)

module.exports = router;


// "name":"Vinayak Singh",
// "email": "vinayak.s@payzo.com",
// "password":"Admin@123",
// "phone":"7440547559",
// "branch":"BTECH CSE",