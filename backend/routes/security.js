const express = require('express');
const router = express.Router();
const securityController = require('../controllers/securityController');
const { authenticateJWT } = require('../middleware');

// Apply JWT authentication to all security routes
router.use(authenticateJWT);

router.post('/start-check', securityController.startCheck);
router.post('/browser-check', securityController.browserCheck);
router.post('/network-check', securityController.networkCheck);
router.post('/device-check', securityController.deviceCheck);
router.post('/vm-check', securityController.vmCheck);
router.post('/screen-check', securityController.screenCheck);
router.post('/final-status', securityController.finalStatus);

module.exports = router;
