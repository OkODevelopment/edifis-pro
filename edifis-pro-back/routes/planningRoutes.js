const express = require('express');
const router = express.Router();
const planningController = require('../controllers/planningController');
const { verifyToken, isAdmin, isAdminOrChefChantier } = require('../middleware/authMiddleware');

// Routes protégées par authentification
router.use(verifyToken);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', planningController.findAll);
router.get('/semaine-courante', planningController.findCurrentWeek);
router.get('/:id', planningController.findOne);
router.get('/utilisateur/:userId', planningController.findByUser);
router.get('/chantier/:chantierId', planningController.findByChantier);

// Routes accessibles uniquement aux administrateurs et chefs de chantier
router.post('/', isAdminOrChefChantier, planningController.create);
router.put('/:id', isAdminOrChefChantier, planningController.update);
router.delete('/:id', isAdminOrChefChantier, planningController.delete);

module.exports = router;