const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");
const users = require("./contacts.json");
const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = () => {
  return users;
};

const getContactById = (contactId) => {
  const contactById = users.find((user) => user.id === contactId);
  return contactById;
};

const removeContact = (contactId) => {
  const contactIndex = users.findIndex((user) => user.id === contactId);
  if (contactIndex !== -1) {
    users.splice(contactIndex, 1);
    fs.writeFileSync(contactsPath, JSON.stringify(users, null, 2));
  } else {
    console.error("Contact not found.");
  }
};

const addContact = (body) => {
  const { name, email, phone } = body;
  const newUser = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  users.push(newUser);
  fs.writeFileSync(contactsPath, JSON.stringify(users, null, 2));
  return newUser;
};

const updateContact = (contactId, body) => {
  const contactToUpdate = users.find((user) => user.id === contactId);
  // Jesli kontakt istnieje to zaktualizuj z wartosciami z body
  if (contactToUpdate) {
    const { name, email, phone } = body;
    contactToUpdate.name = name;
    contactToUpdate.email = email;
    contactToUpdate.phone = phone;
    // Zaktualizowanie pliku contacts.js
    return fs.writeFileSync(contactsPath, JSON.stringify(users, null, 2));
  } else {
    console.error("Contact not found.");
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
