const express = require("express");
const {
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
  getContactById,
} = require("../models/dbQueries");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const contactId = await createContact(req.body, req.user.id);
    res.status(201).json({ message: "Contact successfully created", contactId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "There was an error creating the contact", error: err.message });
  }
});

router.get("/", authenticate, async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const offset = (page - 1) * limit;

  try {
    const contacts = await getAllContacts(req.user.id, parseInt(limit), parseInt(offset), search);
    res.json(contacts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "There was an error fetching the contacts", error: err.message });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  try {
    const affectedRows = await updateContact(req.params.id, req.body, req.user.id);
    if (affectedRows === 0) return res.status(404).json({ message: "Contact not found" });

    res.json({ message: "Contact successfully updated" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "There was an error updating the contact", error: err.message });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const affectedRows = await deleteContact(req.params.id, req.user.id);
    if (affectedRows === 0) return res.status(404).json({ message: "Contact not found" });

    res.json({ message: "Contact successfully deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "There was an error deleting the contact", error: err.message });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const contact = await getContactById(req.params.id, req.user.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    res.json(contact);
  } catch (err) {
    res
      .status(500)
      .json({ message: "There was an error fetching the contact", error: err.message });
  }
});

module.exports = router;
