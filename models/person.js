require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
    const url = process.env.MONGODB_URL

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })

    const personShema = new mongoose.Schema({
        name: {
            type: String,
            minLength: 3,
            required : true,
            unique : true,
            seInsensitive : true,
        },
        number: {
            type: String,
            minLength: 8,
            required : true
        },
    })
    personShema.plugin(uniqueValidator);

    personShema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
    })

    

    module.exports = mongoose.model('Person', personShema)

    