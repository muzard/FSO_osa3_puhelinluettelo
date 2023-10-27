const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const Person = require("./models/person");

const errorHandler = (error, req, res, next) => {
  console.log(error.name);
  console.log("-----");

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).send({
      error: error.message,
    });
  }

  next(error);
};

const morgan = require("morgan");

morgan.token("data", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(cors());
app.use(express.json());
app.use(
  // eslint-disable-next-line prettier/prettier
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);
app.use(express.static("dist"));

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
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    // eslint-disable-next-line prettier/prettier
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`server running on ${PORT}`);
