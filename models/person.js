require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URL
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const personShema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true,
    seInsensitive: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
  },
})
personShema.plugin(uniqueValidator)

personShema.set('toJSON', {
  transform: (document, returnedObject) => {
    const obj = {
      ...returnedObject,
      id: returnedObject._id.toString(),
    }
    delete obj._id
    delete obj.__v
    return obj
  },
})

module.exports = mongoose.model('Person', personShema)
