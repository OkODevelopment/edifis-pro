const express = require('express');
const router = express.Router();
const competenceController = require('../controllers/competenceController');
const { verifyToken, isAdmin, isAdminOrChefChantier } = require('../middleware/authMiddleware');

// Routes protégées par authentification


// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', competenceController.findAll);
router.get('/:id', competenceController.findOne);
router.get('/:id/users', competenceController.findUsers);

// Routes accessibles uniquement aux administrateurs et chefs de chantier
router.post('/', isAdminOrChefChantier, competenceController.create);
router.put('/:id', isAdminOrChefChantier, competenceController.update);

// Routes accessibles uniquement aux administrateurs
router.delete('/:id', isAdmin, competenceController.delete);

module.exports = router;