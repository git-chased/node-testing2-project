const express = require("express");

const Hobbits = require("./hobbits/hobbits-model.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

server.get("/hobbits", (req, res) => {
  Hobbits.getAll()
    .then(hobbits => {
      res.status(200).json(hobbits);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/hobbits/:id", async (req, res) => {
  const hobbit = await Hobbits.getById(req.params.id);
  if (!hobbit) {
    res.status(404).end();
  } else {
    res.json(hobbit);
  }
});

server.post("/hobbits", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  const newHobbit = await Hobbits.insert(req.body);
  res.json(newHobbit);
});

server.delete("/hobbits/:id", async (req, res) => {
  const id = req.params.id
  const delHobbit = await Hobbits.deleteHobbit(id)
  res.status(200).json(delHobbit)
});

server.put("/hobbits/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  try {
    const hobbit = await Hobbits.getById(id);
    if (!hobbit) {
      return res.status(404).json({ message: "Hobbit not found" });
    }
    const updatedHobbit = await Hobbits.update(id, changes);
    res.json(updatedHobbit);
  } catch (error) {
    res.status(500).json({ message: "Error updating hobbit", error: error.message });
  }
});

module.exports = server;