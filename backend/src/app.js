const express = require('express');
const employeeRoutes = require('./routes/employeeRoutes');
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/saleRoutes');
const brandRoutes = require('./routes/brandRoutes');
const customerContactRoutes = require('./routes/customerContactRoutes');
const employeeContactRoutes = require('./routes/employeeContactRoutes');
const paymentMethodRoutes = require('./routes/paymentMethodRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const supplyRoutes = require('./routes/supplyRoutes');
const supplierContactRoutes = require('./routes/supplierContactRoutes');
const attendanceDetailsRoutes = require('./routes/attendanceDetailsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const contactTypeRoutes = require('./routes/contactTypeRoutes');
const employeeAttendanceRoutes = require('./routes/employeeAttendanceRoutes');
const employeeRoleRoutes = require('./routes/employeeRoleRoutes');
const employeeRoleHistoryRoutes = require('./routes/employeeRoleHistoryRoutes');
const returnAndReplacementRoutes = require('./routes/returnAndReplacementRoutes');
const roleTypeRoutes = require('./routes/roleTypeRoutes');
const saleDetailsRoutes = require('./routes/saleDetailsRoutes');
const salePaymentTypeRoutes = require('./routes/salePaymentTypeRoutes');
const statusRoutes = require('./routes/statusRoutes');
const statusReferenceCodeRoutes = require('./routes/statusReferenceCodeRoutes');
const stockoutRoutes = require('./routes/stockoutRoutes');
const supplierAddressRoutes = require('./routes/supplierAddressRoutes');
const supplyDetailsRoutes = require('./routes/supplyDetailsRoutes');

const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.use('/api/employees', employeeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/customer-contacts', customerContactRoutes);
app.use('/api/employee-contacts', employeeContactRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/supplies', supplyRoutes);
app.use('/api/supplier-contacts', supplierContactRoutes);
app.use('/api/attendance-details', attendanceDetailsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact-types', contactTypeRoutes);
app.use('/api/employee-attendances', employeeAttendanceRoutes);
app.use('/api/employee-roles', employeeRoleRoutes);
app.use('/api/employee-role-histories', employeeRoleHistoryRoutes);
app.use('/api/return-and-replacements', returnAndReplacementRoutes);
app.use('/api/role-types', roleTypeRoutes);
app.use('/api/sale-details', saleDetailsRoutes);
app.use('/api/sale-payment-types', salePaymentTypeRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/status-reference-codes', statusReferenceCodeRoutes);
app.use('/api/stockouts', stockoutRoutes);
app.use('/api/supplier-addresses', supplierAddressRoutes);
app.use('/api/supply-details', supplyDetailsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});