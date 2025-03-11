const express = require('express');
const router = express.Router();
const employeeAttendanceController = require('../controllers/employeeAttendanceController');

router.get('/', employeeAttendanceController.getAllEmployeeAttendances);
router.get('/:id', employeeAttendanceController.getEmployeeAttendanceById);
router.post('/', employeeAttendanceController.createEmployeeAttendance);
router.put('/:id', employeeAttendanceController.updateEmployeeAttendance);
router.delete('/:id', employeeAttendanceController.deleteEmployeeAttendance);

module.exports = router;