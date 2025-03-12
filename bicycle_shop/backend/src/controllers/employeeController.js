const bcrypt = require('bcrypt');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await sequelize.query(
            `SELECT * FROM employee`,
            { type: QueryTypes.SELECT }
        );
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await sequelize.query(
            `SELECT * FROM employee WHERE employee_id = :id`,
            {
                type: QueryTypes.SELECT,
                replacements: { id: req.params.id }
            }
        );

        if (employee.length > 0) {
            res.json(employee[0]);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const [result] = await sequelize.query(
            `INSERT INTO employee (first_name, last_name, middle_name, gender, birth_date, username, password, employee_status)
             VALUES (:first_name, :last_name, :middle_name, :gender, :birth_date, :username, :password, :employee_status)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    middle_name: req.body.middle_name || null,
                    gender: req.body.gender,
                    birth_date: req.body.birth_date || null,
                    username: req.body.username,
                    password: hashedPassword,
                    employee_status: req.body.employee_status
                }
            }
        );

        res.status(201).json({ message: 'Employee created successfully', employee_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const [updated] = await sequelize.query(
            `UPDATE employee SET 
                first_name = :first_name,
                last_name = :last_name,
                middle_name = :middle_name,
                gender = :gender,
                birth_date = :birth_date,
                username = :username,
                password = :password,
                employee_status = :employee_status
             WHERE employee_id = :id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    middle_name: req.body.middle_name || null,
                    gender: req.body.gender,
                    birth_date: req.body.birth_date || null,
                    username: req.body.username,
                    password: req.body.password,
                    employee_status: req.body.employee_status,
                    id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedEmployee = await sequelize.query(
                `SELECT * FROM employee WHERE employee_id = :id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { id: req.params.id }
                }
            );
            res.json(updatedEmployee[0]);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM employee WHERE employee_id = :id`,
            {
                type: QueryTypes.DELETE,
                replacements: { id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.findEmployeeByUsernameAndPassword = async (req, res) => {
    try {
        const { username, password } = req.body;

        const employee = await sequelize.query(
            `SELECT * FROM employee WHERE username = :username`,
            {
                type: QueryTypes.SELECT,
                replacements: { username }
            }
        );

        if (employee.length > 0) {
            const isPasswordValid = await bcrypt.compare(password, employee[0].password);
            if (isPasswordValid) {
                res.json(employee[0]);
            } else {
                res.status(401).json({ message: 'Invalid password' });
            }
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.validateSession = async (req, res) => {
    try {
        const { sessionToken } = req.body;
        const [employee_id, base64Password] = sessionToken.split(':');
        const password = Buffer.from(base64Password, 'base64').toString('utf-8');

        const employee = await sequelize.query(
            `SELECT * FROM employee WHERE employee_id = :id`,
            {
                type: QueryTypes.SELECT,
                replacements: { id: employee_id }
            }
        );

        if (employee.length > 0) {
            if (password === employee[0].password) {
                res.json({ valid: true });
            } else {
                res.status(401).json({ valid: false });
            }
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
