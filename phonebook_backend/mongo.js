const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("Invalid CLI arguments");
    process.exit(1)
}

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length < 4) {
    const password = process.argv[2]
    const url = `mongodb+srv://youngprincess86:${password}@cluster0.q0bgm5f.mongodb.net/phonebookApp?retryWrites=true&w=majority`

    mongoose
        .connect(url)
        .then(result => {
            console.log("phonebook:");
            Person.find({}).then(result => {
                result.forEach(person => {
                    console.log(`${person.name} ${person.number}`);
                })
            })
        })
        .then(() => {
            return mongoose.connection.close()
        })
        .catch(err => console.log(err))
} else if (process.argv.length < 6) {
    const password = process.argv[2]
    const name = process.argv[3]
    const number = process.argv[4]

    const url = `mongodb+srv://youngprincess86:${password}@cluster0.q0bgm5f.mongodb.net/phonebookApp?retryWrites=true&w=majority`

    mongoose
        .connect(url)
        .then(result => {
            const person = new Person({
                name: name,
                number: number
            })
            console.log(`Added ${person.name} number ${person.number} to phonebook`);
            return person.save()
        })
        .then(result => {
            mongoose.connection.close()
        })
        .catch(err => console.log(err))
}



