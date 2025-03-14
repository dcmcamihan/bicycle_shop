const express = require('express');
const router = express.Router();
const attendanceDetailsController = require('../controllers/attendanceDetailsController');

router.get('/', attendanceDetailsController.getAllAttendanceDetails);
router.get('/:id', attendanceDetailsController.getAttendanceDetailsById);
router.post('/', attendanceDetailsController.createAttendanceDetails);
router.put('/:id', attendanceDetailsController.updateAttendanceDetails);
router.delete('/:id', attendanceDetailsController.deleteAttendanceDetails);

module.exports = router;