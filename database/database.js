const mongoose = require('mongoose')
require('dotenv').config()

exports.connection = mongoose.connect(process.env.localUri, { useNewUrlParser: true }).then(con => {
    console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
})