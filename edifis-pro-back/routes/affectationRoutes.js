const express = require('express');
const router = express.Router();
const affectationController = require('../controllers/affectationController');
const { verifyToken, isAdmin, isAdminOrChefChantier } = require('../middleware/authMiddleware');

// Routes protégées par authentification
router.use(verifyToken);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', affectationController.findAll);
router.get('/:id', affectationController.findOne);
router.get('/utilisateur/:userId', affectationController.findByUser);
router.get('/chantier/:chantierId', affectationController.findByChantier);

// Routes accessibles uniquement aux administrateurs et chefs de chantier
router.post('/', isAdminOrChefChantier, affectationController.create);
router.put('/:id', isAdminOrChefChantier, affectationController.update);
router.delete('/:id', isAdminOrChefChantier, affectationController.delete);

module.exports = router;