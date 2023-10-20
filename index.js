const express = require("express");
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

const PORT = 3001;
app.listen(PORT);
console.log(`server running on ${PORT}`);
