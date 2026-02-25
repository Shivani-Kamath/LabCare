const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin.controller');

router.post('/login', admin.adminLogin);
router.post('/users', admin.addUser);
router.delete('/users/:id', admin.deleteUser);
router.post('/students/bulk', admin.bulkCreateStudents);
router.post('/students/archive-or-delete', admin.archiveOrDeleteStudents);
router.patch('/reset-password', admin.resetPassword);

module.exports = router;


