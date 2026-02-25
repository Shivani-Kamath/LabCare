const bcrypt = require('bcrypt');
const Users = require('../models/user');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

exports.adminLogin = async (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.json({ message: 'Admin authenticated' });
};

exports.addUser = async (req, res) => {
  try {
    const { full_name, email, phone, role, password } = req.body;
    if (!full_name || !role || !password) return res.status(400).json({ error: 'Missing required fields' });
    if (["technician", "lab_incharge", "admin"].includes(role) && !email) {
      return res.status(400).json({ error: 'Email required for this role' });
    }
    const hashed = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const user = await Users.create({ full_name, email, phone: phone || 'NA', role, password: hashed });
    res.status(201).json({ message: 'User created', user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await Users.findByIdAndDelete(id);
    res.json({ message: 'User deleted' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

function incrementUSN(usn) {
  const match = usn.match(/^(.*?)(\d+)$/);
  if (!match) return null;
  const prefix = match[1];
  const num = match[2];
  const nextNum = String(parseInt(num, 10) + 1).padStart(num.length, '0');
  return prefix + nextNum;
}

exports.bulkCreateStudents = async (req, res) => {
  try {
    const { startUSN, endUSN, defaultPassword = 'batch1' } = req.body;
    if (!startUSN || !endUSN) return res.status(400).json({ error: 'startUSN and endUSN required' });
    const emails = new Set();
    const toInsert = [];
    let curr = startUSN;
    const hashed = bcrypt.hashSync(defaultPassword, bcrypt.genSaltSync(10));
    while (true) {
      const email = `${curr}@students.local`;
      if (!emails.has(email)) {
        toInsert.push({ full_name: curr, email, phone: 'NA', role: 'student', password: hashed });
        emails.add(email);
      }
      if (curr === endUSN) break;
      const next = incrementUSN(curr);
      if (!next) return res.status(400).json({ error: 'Invalid USN format' });
      curr = next;
    }
    const created = await Users.insertMany(toInsert, { ordered: false });
    res.status(201).json({ message: 'Students created', count: created.length });
  } catch (e) {
    if (e.writeErrors) {
      return res.status(201).json({ message: 'Students created (some duplicates skipped)', count: e.result?.result?.nInserted || 0 });
    }
    res.status(400).json({ error: e.message });
  }
};

exports.archiveOrDeleteStudents = async (req, res) => {
  try {
    const { startUSN, endUSN, action = 'delete' } = req.body;
    if (!startUSN || !endUSN) return res.status(400).json({ error: 'startUSN and endUSN required' });
    const range = [];
    let curr = startUSN;
    while (true) {
      range.push(curr);
      if (curr === endUSN) break;
      curr = incrementUSN(curr);
      if (!curr) return res.status(400).json({ error: 'Invalid USN format' });
    }
    if (action === 'archive') {
      const resu = await Users.updateMany({ email: { $in: range.map(r => `${r}@students.local`) } }, { $set: { role: 'student_archived' } });
      return res.json({ message: 'Students archived', modified: resu.modifiedCount });
    }
    const resd = await Users.deleteMany({ email: { $in: range.map(r => `${r}@students.local`) } });
    return res.json({ message: 'Students deleted', deleted: resd.deletedCount });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword) return res.status(400).json({ error: 'userId and newPassword required' });
    const hashed = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
    await Users.findByIdAndUpdate(userId, { password: hashed });
    res.json({ message: 'Password reset' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};


