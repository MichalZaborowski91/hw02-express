const { Contact } = require("./contacts.model");

const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    console.error(error.message);
  }
};

const getContactById = async (id) => {
  try {
    return await Contact.findById(id);
  } catch (error) {
    console.error(error.message);
  }
};

const removeContact = async (id) => {
  try {
    await Contact.findByIdAndDelete(id);
  } catch (error) {
    console.error(error.message);
  }
};

const addContact = async (contact) => {
  try {
    const newContact = new Contact(contact);
    const savedContact = await newContact.save();
    return savedContact;
  } catch (error) {
    console.error(error.message);
  }
};

const updateContact = async (id, modifiedContact) => {
  try {
    return await Contact.findByIdAndUpdate(id, modifiedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
  }
};

const updateStatusContact = async (contactId, favorite) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );
    return updatedContact;
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
