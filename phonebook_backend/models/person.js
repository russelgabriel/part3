const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

console.log("connecting to", url)

mongoose.connect(url)
    .then(resul => {
        console.log("connected to MongoDB");
    })
    .catch(err => {
        console.log("error connecting to MongoDB", err.message);
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        unique: [true, "Name must be unique"],
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: (number) => {
                const regex = /(\d{3,4}-\d{3}-\d{4})|(^\d{10,11}$)/
                return regex.test(number)
            },
            message: props => `${props.value} is not a valid phone number`
        },
        required: true
    }
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)