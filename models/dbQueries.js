const db = require("../config/db");

const createUser = async (name, email, password) => {
  const [result] = await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
    name,
    email,
    password,
  ]);
  return result.insertId;
};

const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

const createContact = async (contact, userId) => {
  const [result] = await db.query(
    "INSERT INTO contacts (first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address, posted_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      contact.first_name,
      contact.middle_name,
      contact.last_name,
      contact.email,
      contact.phone_number_1,
      contact.phone_number_2,
      contact.address,
      userId,
    ]
  );
  return result.insertId;
};

const getAllContacts = async (userId, limit, offset, search) => {
  let query = "SELECT * FROM contacts WHERE posted_by = ?";
  const params = [userId];

  if (search) {
    query += " AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += " ORDER BY first_name LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

const updateContact = async (contactId, updatedData, userId) => {
  const [result] = await db.query(
    "UPDATE contacts SET first_name = ?, middle_name = ?, last_name = ?, email = ?, phone_number_1 = ?, phone_number_2 = ?, address = ? WHERE id = ? AND posted_by = ?",
    [
      updatedData.first_name,
      updatedData.middle_name,
      updatedData.last_name,
      updatedData.email,
      updatedData.phone_number_1,
      updatedData.phone_number_2,
      updatedData.address,
      contactId,
      userId,
    ]
  );
  return result.affectedRows;
};

const deleteContact = async (contactId, userId) => {
  try {
    const [result] = await db.query("DELETE FROM contacts WHERE id = ? AND posted_by = ?", [
      contactId,
      userId,
    ]);
    return result.affectedRows;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getContactById = async (contactId, userId) => {
  try {
    const [rows] = await db.query("SELECT * FROM contacts WHERE id = ? AND posted_by = ?", [
      contactId,
      userId,
    ]);
    return rows[0];
  } catch (err) {
    throw new Error("Error fetching contact");
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
  getContactById,
};
