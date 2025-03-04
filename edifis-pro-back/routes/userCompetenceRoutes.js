const express = require('express');
const router = express.Router();
const userCompetenceController = require('../controllers/userCompetenceController');
const { verifyToken, isAdmin, isAdminOrChefChantier } = require('../middleware/authMiddleware');

// Routes protégées par authentification
router.use(verifyToken);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', userCompetenceController.findAll);
router.get('/:id', userCompetenceController.findOne);
router.get('/utilisateur/:userId', userCompetenceController.findByUser);
router.get('/competence/:competenceId', userCompetenceController.findByCompetence);

// Routes accessibles uniquement aux administrateurs et chefs de chantier
router.post('/', isAdminOrChefChantier, userCompetenceController.create);
router.put('/:id', isAdminOrChefChantier, userCompetenceController.update);
router.delete('/:id', isAdminOrChefChantier, userCompetenceController.delete);

module.exports = router;