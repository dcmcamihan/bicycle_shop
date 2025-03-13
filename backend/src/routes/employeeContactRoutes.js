const express = require('express');
const router = express.Router();
const employeeContactController = require('../controllers/employeeContactController');

router.get('/', employeeContactController.getAllEmployeeContacts);
router.get('/:id', employeeContactController.getEmployeeContactById);
router.post('/', employeeContactController.createEmployeeContact);
router.put('/:id', employeeContactController.updateEmployeeContact);
router.delete('/:id', employeeContactController.deleteEmployeeContact);

module.exports = router;