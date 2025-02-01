const express = require("express");
const router = express.Router();
const Document = require("../models/Document");

// Create a new document
router.post("/", async (req, res) => {
  try {
    const newDoc = new Document(req.body);
    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all documents
router.get("/", async (req, res) => {
  try {
    const docs = await Document.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a document by ID
router.get("/:id", async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a document
router.put("/:id", async (req, res) => {
  try {
    const updatedDoc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a document
router.delete("/:id", async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
