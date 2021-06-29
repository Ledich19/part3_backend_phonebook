const mongoose = require('mongoose')

if (process.argv.length === 5) {
  const password = process.argv[2]
  const personName = process.argv[3]
  const phoneNumber = process.argv[4]

  const url = `mongodb+srv://follstack:${password}@cluster0.9g99w.mongodb.net/phonebook?retryWrites=true&w=majority`

  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })

  const personShema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', personShema)

  const person = new Person({
    name: personName,
    number: phoneNumber,
  })

  person.save().then(() => {
    console.log(`\u001B[32madded ${personName} number: ${phoneNumber} to phonebook\u001B[0m`)
    mongoose.connection.close()
  })
} else if (process.argv.length === 3) {
  const password = process.argv[2]

  const url = `mongodb+srv://follstack:${password}@cluster0.9g99w.mongodb.net/phonebook?retryWrites=true&w=majority`

  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })

  const personShema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', personShema)

  Person.find({}).then((result) => {
    console.log('\u001B[32mphonebook:')
    result.forEach((note) => {
      console.log(`\u001B[34m${note.name}  \u001B[0m ${note.number}`)
    })
    mongoose.connection.close()
  })
} else {
  console.log('01B[31menter data in format node mongo.js yourpassword "Name" 666-666666 or node mongo.js yourpassword\u001B[0m')
  process.exit(1)
}
