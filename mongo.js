const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://arttukokki:${password}@cluster0.fh1qioj.mongodb.net/people?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 4) {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length > 4) {
  person.save().then((result) => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]}`);
    mongoose.connection.close();
  });
}
