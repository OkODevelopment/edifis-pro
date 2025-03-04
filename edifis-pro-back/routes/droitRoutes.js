const express = require('express');
const router = express.Router();
const droitController = require('../controllers/droitController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Routes protégées par authentification
router.use(verifyToken);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', droitController.findAll);
router.get('/:id', droitController.findOne);

// Routes accessibles uniquement aux administrateurs
router.post('/', isAdmin, droitController.create);
router.put('/:id', isAdmin, droitController.update);
router.delete('/:id', isAdmin, droitController.delete);

module.exports = router;