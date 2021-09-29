const fs = require("fs/promises");
const path = require("path");

const shortid = require("shortid");

const contactsPath = path.resolve("db/contacts.json");

const getContactsList = async () => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
};

const listContacts = async () => {
  const contacts = await getContactsList();
  console.table(contacts);
};

const getContactById = async (id) => {
  const contactId = isNaN(id) ? id : Number(id);

  const contacts = await getContactsList();
  const contactById = contacts.find((contact) => contact.id === contactId);
  if (!contactById) {
    console.log(`No contacts with id ${id}`);
    return;
  }
  console.log(contactById);
};

const addContact = async (name, email, phone) => {
  if (!name || !email || !phone) {
    console.log("Please enter name, email and phone number.");
    return;
  }

  const contacts = await getContactsList();
  const newContact = {
    id: shortid.generate(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  console.log(`Contact ${name} added`);
  console.table(contacts);
};

const removeContact = async (id) => {
  const contactId = isNaN(id) ? id : Number(id);
  const contacts = await getContactsList();
  const contactById = contacts.find((contact) => contact.id === contactId);
  if (!contactById) {
    console.log(`No contacts with id ${id}`);
    return;
  }

  const clearedContactList = contacts.filter((contact) => contact.id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(clearedContactList));
  console.log(`Contact with id ${contactId} deleted`);
  console.table(clearedContactList);
};

const actions = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};

module.exports = actions;
