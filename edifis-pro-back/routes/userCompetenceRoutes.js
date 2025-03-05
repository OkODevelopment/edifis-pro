const express = require('express');
const router = express.Router();
const userCompetenceController = require('../controllers/userCompetenceController');
const { verifyToken, isAdmin, isAdminOrChefChantier } = require('../middleware/authMiddleware');

// Routes protégées par authentification


// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', userCompetenceController.findAll);
router.get('/:id', userCompetenceController.findOne);
router.get('/user/:id', userCompetenceController.findByUserId);
router.get('/competence/:competenceId', userCompetenceController.findByCompetence);

// Routes accessibles uniquement aux administrateurs et chefs de chantier
router.post('/', userCompetenceController.create);
router.put('/:id', userCompetenceController.update);
router.delete('/:id', userCompetenceController.delete);

module.exports = router;