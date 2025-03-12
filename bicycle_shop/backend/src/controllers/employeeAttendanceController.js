const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllEmployeeAttendances = async (req, res) => {
    try {
        const query = `
            SELECT 
                ea.attendance_id,
                ea.employee_id,
                e.first_name,
                e.middle_name,
                e.last_name,
                e.gender,
                e.birth_date,
                e.username,
                s.description AS employee_status,
                ea.date,
                s2.description AS attendance_status,
                ad.time_in,
                ad.time_out,
                ad.remarks
            FROM 
                employee_attendance ea
            JOIN 
                employee e ON ea.employee_id = e.employee_id
            JOIN 
                status s ON e.employee_status = s.status_code
            JOIN 
                status s2 ON ea.attendance_status = s2.status_code
            LEFT JOIN 
                attendance_details ad ON ea.attendance_id = ad.attendance_id
            WHERE 
                s.status_reference_code = 'EMPLSTAT'
            AND 
                s2.status_reference_code = 'ATTNSTAT';
        `;
        const employeeAttendances = await sequelize.query(query, { type: QueryTypes.SELECT });
        res.json(employeeAttendances);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeAttendanceById = async (req, res) => {
    try {
        const query = `
            SELECT 
                ea.attendance_id,
                ea.employee_id,
                e.first_name,
                e.middle_name,
                e.last_name,
                e.gender,
                e.birth_date,
                e.username,
                s.description AS employee_status,
                ea.date,
                s2.description AS attendance_status,
                ad.time_in,
                ad.time_out,
                ad.remarks
            FROM 
                employee_attendance ea
            JOIN 
                employee e ON ea.employee_id = e.employee_id
            JOIN 
                status s ON e.employee_status = s.status_code
            JOIN 
                status s2 ON ea.attendance_status = s2.status_code
            LEFT JOIN 
                attendance_details ad ON ea.attendance_id = ad.attendance_id
            WHERE 
                ea.attendance_id = :attendance_id
            AND 
                s.status_reference_code = 'EMPLSTAT'
            AND 
                s2.status_reference_code = 'ATTNSTAT';
        `;
        const employeeAttendance = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements: { attendance_id: req.params.id }
        });

        if (employeeAttendance.length > 0) {
            res.json(employeeAttendance[0]);
        } else {
            res.status(404).json({ message: 'Employee attendance not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEmployeeAttendance = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO employee_attendance (employee_id, date, attendance_status)
             VALUES (:employee_id, :date, :attendance_status)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    employee_id: req.body.employee_id,
                    date: req.body.date,
                    attendance_status: req.body.attendance_status
                }
            }
        );

        res.status(201).json({ message: 'Employee attendance created successfully', attendance_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEmployeeAttendance = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE employee_attendance SET 
                employee_id = :employee_id,
                date = :date,
                attendance_status = :attendance_status
             WHERE attendance_id = :attendance_id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    employee_id: req.body.employee_id,
                    date: req.body.date,
                    attendance_status: req.body.attendance_status,
                    attendance_id: req.params.id
                }
            }
        );

        if (updated) {
            const query = `
                SELECT 
                    ea.attendance_id,
                    ea.employee_id,
                    e.first_name,
                    e.middle_name,
                    e.last_name,
                    e.gender,
                    e.birth_date,
                    e.username,
                    s.description AS employee_status,
                    ea.date,
                    s2.description AS attendance_status,
                    ad.time_in,
                    ad.time_out,
                    ad.remarks
                FROM 
                    employee_attendance ea
                JOIN 
                    employee e ON ea.employee_id = e.employee_id
                JOIN 
                    status s ON e.employee_status = s.status_code
                JOIN 
                    status s2 ON ea.attendance_status = s2.status_code
                LEFT JOIN 
                    attendance_details ad ON ea.attendance_id = ad.attendance_id
                WHERE 
                    ea.attendance_id = :attendance_id
                AND 
                    s.status_reference_code = 'EMPLSTAT'
                AND 
                    s2.status_reference_code = 'ATTNSTAT';
            `;
            const updatedEmployeeAttendance = await sequelize.query(query, {
                type: QueryTypes.SELECT,
                replacements: { attendance_id: req.params.id }
            });
            res.json(updatedEmployeeAttendance[0]);
        } else {
            res.status(404).json({ message: 'Employee attendance not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEmployeeAttendance = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM employee_attendance WHERE attendance_id = :attendance_id`,
            {
                type: QueryTypes.DELETE,
                replacements: { attendance_id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Employee attendance not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};