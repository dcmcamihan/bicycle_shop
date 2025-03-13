const express = require('express');
const router = express.Router();
const employeeRoleHistoryController = require('../controllers/employeeRoleHistoryController');

router.get('/', employeeRoleHistoryController.getAllEmployeeRoleHistories);
router.get('/:id', employeeRoleHistoryController.getEmployeeRoleHistoryById);
router.post('/', employeeRoleHistoryController.createEmployeeRoleHistory);
router.put('/:id', employeeRoleHistoryController.updateEmployeeRoleHistory);
router.delete('/:id', employeeRoleHistoryController.deleteEmployeeRoleHistory);

module.exports = router;