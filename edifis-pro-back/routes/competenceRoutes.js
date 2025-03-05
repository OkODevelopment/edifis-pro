const express = require('express');
const router = express.Router();
const competenceController = require('../controllers/competenceController');
//const { verifyToken, isAdmin, isAdminOrChefChantier } = require('../middleware/authMiddleware');

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', competenceController.findAll);
router.get('/:id', competenceController.findOne);
router.get('/:id/users', competenceController.findUsers);

// Routes accessibles uniquement aux administrateurs et chefs de chantier
router.post('/', competenceController.create);
router.put('/:id', competenceController.update);

// Routes accessibles uniquement aux administrateurs
router.delete('/:id', competenceController.delete);

module.exports = router;