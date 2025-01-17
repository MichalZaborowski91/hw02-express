const express = require("express");
const contactsController = require("./contacts.controller");
const { validateContactMiddleware } = require("./contacts.validators");
const { authMiddleware } = require("../auth/auth.middleware");

const contactsRouter = express.Router();

contactsRouter.use(authMiddleware);
contactsRouter.get("/", contactsController.listContactsHandler);
contactsRouter.get("/:contactId", contactsController.getContactByIdHandler);
contactsRouter.post(
  "/",
  validateContactMiddleware,
  contactsController.addContactHandler
);
contactsRouter.delete("/:contactId", contactsController.deleteHandler);
contactsRouter.put(
  "/:contactId",
  validateContactMiddleware,
  contactsController.updateHandler
);
contactsRouter.patch(
  "/:contactId/favorite",
  contactsController.favoriteHandler
);

module.exports = {
  contactsRouter,
};
