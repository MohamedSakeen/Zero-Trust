const securityService = require('../services/securityService');

// Helper to get user/session ID (supports test header)
function getSessionId(req) {
  return req.headers['x-test-session'] || req.sessionID;
}

exports.startCheck = async (req, res) => {
  try {
    const userId = getSessionId(req);
    await securityService.initSession(userId);
    res.json({ success: true, message: 'Security check session started', sessionId: userId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.browserCheck = async (req, res) => {
  try {
    const userId = getSessionId(req);
    const result = await securityService.browserCheck(userId, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.networkCheck = async (req, res) => {
  try {
    const userId = getSessionId(req);
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const result = await securityService.networkCheck(userId, ip, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deviceCheck = async (req, res) => {
  try {
    const userId = getSessionId(req);
    const result = await securityService.deviceCheck(userId, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.vmCheck = async (req, res) => {
  try {
    const userId = getSessionId(req);
    const result = await securityService.vmCheck(userId, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.screenCheck = async (req, res) => {
  try {
    const userId = getSessionId(req);
    const result = await securityService.screenCheck(userId, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.finalStatus = async (req, res) => {
  try {
    const userId = getSessionId(req);
    const result = await securityService.finalStatus(userId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
