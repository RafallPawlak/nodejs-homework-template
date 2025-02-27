const express = require('express');
const auth = require("../../auth/auth");
const { listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFavorite } = require('../../controllers/contacts');

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  const ownerId = req.user.id;
  const response = await listContacts(ownerId);
  return res.status(200).json(response);
});


router.get("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await getContactById(id);
    if (!response) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(response);
  } catch {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.post('/', auth, async (req, res, next) => {
  const id = req.user.id;
  try {
    const contact = await addContact(req.body, id);
    return res.status(201).json(contact);
  } catch {
    return res.status(500).json({"message": "Something went wrong"});
  }
})

router.delete("/:id", auth, async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ "message": "Not found"});
  }
  try {
    await removeContact(id);
    return res.status(200).json({"message": "contact deleted"});
  } catch {
    return res.status(500).json({ "message": "Something went wrong" });
  }
})

router.put("/:id", auth, async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ "message": "Not found" });
  }
try {
    const contactUpdate = await updateContact( id, req.body);
    return res.status(200).json(contactUpdate);
  } catch (error) {
    next(error);
    return res.status(500).json({ "message": "Something went wrong" });
  }
});

router.patch("/:id/favorite", auth, async (req, res, next) => {
  const { id } = req.params;
  const { favorite = false } = req.body
  if (!id) {
    return res.status(404).json({ "message": "Not found" });
  }
  try {
    if (typeof req.body.favorite !== "boolean") {
      return res.status(400).send({ "message": "missing field favorite" });
    }
    const favoriteUpdate = await updateFavorite( id, { favorite });
    return res.status(200).json(favoriteUpdate);
  } catch (error) {
    next(error);
    return res.status(500).json({ "message": "Something went wrong" });
  }
});

module.exports = router
