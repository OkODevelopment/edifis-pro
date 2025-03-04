const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin, isAdminOrChefChantier } = require('../middleware/authMiddleware');

// Routes protégées par authentification


// Routes accessibles aux administrateurs et chefs de chantier
router.get('/', userController.findAll);
router.get('/competence/:competenceId', isAdminOrChefChantier, userController.findByCompetence);
router.get('/chantier/:chantierId', isAdminOrChefChantier, userController.findByChantier);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/:id', userController.findOne);

// Routes accessibles uniquement aux administrateurs
router.post('/', userController.create);
router.put('/:id',  userController.update);
router.delete('/:id',  userController.delete);

module.exports = router;