const AttendanceDetails = require('../models/attendanceDetailsModel');

exports.getAllAttendanceDetails = async (req, res) => {
    try {
        const attendanceDetails = await AttendanceDetails.findAll();
        res.json(attendanceDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAttendanceDetailsById = async (req, res) => {
    try {
        const attendanceDetails = await AttendanceDetails.findByPk(req.params.id);
        if (attendanceDetails) {
            res.json(attendanceDetails);
        } else {
            res.status(404).json({ message: 'Attendance details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createAttendanceDetails = async (req, res) => {
    try {
        const newAttendanceDetails = await AttendanceDetails.create(req.body);
        res.status(201).json(newAttendanceDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAttendanceDetails = async (req, res) => {
    try {
        const [updated] = await AttendanceDetails.update(req.body, {
            where: { attendance_details_id: req.params.id }
        });
        if (updated) {
            const updatedAttendanceDetails = await AttendanceDetails.findByPk(req.params.id);
            res.json(updatedAttendanceDetails);
        } else {
            res.status(404).json({ message: 'Attendance details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAttendanceDetails = async (req, res) => {
    try {
        const deleted = await AttendanceDetails.destroy({
            where: { attendance_details_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Attendance details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};