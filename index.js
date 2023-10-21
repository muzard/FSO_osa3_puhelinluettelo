const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

let nums = [
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 1,
  },
  {
    name: "Mary Poppins",
    number: "02600 420",
    id: 2,
  },
  {
    name: "Add",
    number: "num",
    id: 3,
  },
];

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

const generateId = () => {
  return Math.floor(Math.random() * 100000);
};

const findExisting = (name, num) => {
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
};

app.get("/info", (req, res) => {
  const people = `Phonebook has info for ${nums.length} people`;
  const date = Date();

  const msg = `<div>${people}</div></br><div>${date}</div>`;
  res.send(msg);
});

app.get("/api/persons", (req, res) => {
  res.json(nums);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const person = nums.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  nums = nums.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }
  const exists = findExisting(body.name, body.number);
  if (exists) {
    return res.status(400).json({
      error: exists,
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  nums = nums.concat(person);

  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`server running on ${PORT}`);
