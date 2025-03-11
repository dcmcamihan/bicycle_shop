const express = require('express');
const router = express.Router();
const employeeRoleController = require('../controllers/employeeRoleController');

router.get('/', employeeRoleController.getAllEmployeeRoles);
router.get('/:id', employeeRoleController.getEmployeeRoleById);
router.post('/', employeeRoleController.createEmployeeRole);
router.put('/:id', employeeRoleController.updateEmployeeRole);
router.delete('/:id', employeeRoleController.deleteEmployeeRole);

module.exports = router;