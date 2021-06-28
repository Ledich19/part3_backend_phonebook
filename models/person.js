require('dotenv').config()
const mongoose = require('mongoose')

    const url = process.env.MONGODB_URL

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })

    const personShema = new mongoose.Schema({
        name: String,
        number: String,
    })
    personShema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
    })

    module.exports = mongoose.model('Person', personShema)

    