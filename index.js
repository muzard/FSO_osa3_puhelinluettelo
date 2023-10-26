require("dotenv").config();
const Person = require("./models/person");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

morgan.token("data", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(
  // eslint-disable-next-line prettier/prettier
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);
/* const findExisting = (name, num) => {
  const nameExists = nums.find((person) => person.name === name);
  const numExists = nums.find((person) => person.number === num);

  if (nameExists && numExists) {
    return "person already exists";
  } else if (nameExists) {
    return "name must be unique";
  } else if (numExists) {
    return "number must be unique";
  }
  return false;
}; */

app.get("/info", (req, res, next) => {
  Person.find({}).then((people) => {
    const num = `Phonebook has info for ${people.length} people`;
    const date = Date();

    const msg = `<div>${num}</div></br><div>${date}</div>`;
    res.send(msg);
  });
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((people) => {
      console.log(people, "people");
      res.json(people);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name && body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`server running on ${PORT}`);
