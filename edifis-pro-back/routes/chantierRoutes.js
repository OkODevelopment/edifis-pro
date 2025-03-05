const express = require('express');
const router = express.Router();
const chantierController = require('../controllers/chantierController');
const { verifyToken, isAdmin, isAdminOrChefChantier } = require('../middleware/authMiddleware');

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', chantierController.findAll);
router.get('/en-cours', chantierController.findInProgress);
router.get('/a-venir', chantierController.findUpcoming);
router.get('/termines', chantierController.findCompleted);
router.get('/:id', chantierController.findOne);

// Routes accessibles uniquement aux administrateurs et chefs de chantier
router.post('/',  chantierController.create);
router.put('/:id',  chantierController.update);
router.post('/:id/affecter',  chantierController.affectUser);
router.delete('/:id/utilisateur/:userId',  chantierController.removeUser);

// Routes accessibles uniquement aux administrateurs
router.delete('/:id', isAdmin, chantierController.delete);

module.exports = router;