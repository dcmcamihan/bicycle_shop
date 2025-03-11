const express = require('express');
const router = express.Router();
const roleTypeController = require('../controllers/roleTypeController');

router.get('/', roleTypeController.getAllRoleTypes);
router.get('/:role_type_code', roleTypeController.getRoleTypeByCode);
router.post('/', roleTypeController.createRoleType);
router.put('/:role_type_code', roleTypeController.updateRoleType);
router.delete('/:role_type_code', roleTypeController.deleteRoleType);

module.exports = router;