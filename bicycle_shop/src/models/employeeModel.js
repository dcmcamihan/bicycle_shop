const db = require('../config/db');

const getAllEmployees = async () => {
    const query = 'SELECT * FROM employee';
    const [rows] = await db.query(query);
    return rows;
};

const getEmployeeById = async (id) => {
    const query = 'SELECT * FROM employee WHERE employee_id = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

const createEmployee = async (employee) => {
    const query = 'INSERT INTO employee SET ?';
    const [result] = await db.query(query, employee);
    return result.insertId;
};

const updateEmployee = async (id, employee) => {
    const query = 'UPDATE employee SET ? WHERE employee_id = ?';
    await db.query(query, [employee, id]);
};

const deleteEmployee = async (id) => {
    const query = 'DELETE FROM employee WHERE employee_id = ?';
    await db.query(query, [id]);
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};