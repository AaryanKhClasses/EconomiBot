const mongoose = require('mongoose')
require('dotenv').config()

module.exports = async() =>{
    await mongoose.connect(process.env.MONGOPASS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    return mongoose
}