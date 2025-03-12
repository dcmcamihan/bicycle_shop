const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllAttendanceDetails = async (req, res) => {
    try {
        const attendanceDetails = await sequelize.query(
            `SELECT * FROM attendance_details`,
            { type: QueryTypes.SELECT }
        );
        res.json(attendanceDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAttendanceDetailsById = async (req, res) => {
    try {
        const attendanceDetails = await sequelize.query(
            `SELECT * FROM attendance_details WHERE attendance_detail_id = :id`,
            {
                type: QueryTypes.SELECT,
                replacements: { id: req.params.id }
            }
        );

        if (attendanceDetails.length > 0) {
            res.json(attendanceDetails[0]);
        } else {
            res.status(404).json({ message: 'Attendance details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createAttendanceDetails = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO attendance_details (attendance_id, time_in, time_out, remarks)
             VALUES (:attendance_id, :time_in, :time_out, :remarks)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    attendance_id: req.body.attendance_id,
                    time_in: req.body.time_in,
                    time_out: req.body.time_out,
                    remarks: req.body.remarks || null
                }
            }
        );

        res.status(201).json({ message: 'Attendance details created successfully', attendance_detail_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAttendanceDetails = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE attendance_details SET 
                attendance_id = :attendance_id,
                time_in = :time_in,
                time_out = :time_out,
                remarks = :remarks
             WHERE attendance_detail_id = :id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    attendance_id: req.body.attendance_id,
                    time_in: req.body.time_in,
                    time_out: req.body.time_out,
                    remarks: req.body.remarks || null,
                    id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedAttendanceDetails = await sequelize.query(
                `SELECT * FROM attendance_details WHERE attendance_detail_id = :id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { id: req.params.id }
                }
            );
            res.json(updatedAttendanceDetails[0]);
        } else {
            res.status(404).json({ message: 'Attendance details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAttendanceDetails = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM attendance_details WHERE attendance_detail_id = :id`,
            {
                type: QueryTypes.DELETE,
                replacements: { id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Attendance details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
