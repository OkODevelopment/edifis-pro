const db = require('../models');
const Droit = db.Droit;

// Récupérer tous les droits
exports.findAll = async (req, res) => {
  try {
    const droits = await Droit.findAll();
    res.status(200).json(droits);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des droits', error: error.message });
  }
};

// Récupérer un droit par son ID
exports.findOne = async (req, res) => {
  try {
    const droit = await Droit.findByPk(req.params.id);
    
    if (!droit) {
      return res.status(404).json({ message: `Droit avec l'ID ${req.params.id} non trouvé` });
    }
    
    res.status(200).json(droit);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du droit', error: error.message });
  }
};

// Créer un nouveau droit
exports.create = async (req, res) => {
  try {
    // Valider la requête
    if (!req.body.libelle) {
      return res.status(400).json({ message: 'Le libellé du droit est requis' });
    }

    // Créer le droit
    const droit = await Droit.create({
      libelle: req.body.libelle
    });
    
    res.status(201).json(droit);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du droit', error: error.message });
  }
};

// Mettre à jour un droit
exports.update = async (req, res) => {
  try {
    const droit = await Droit.findByPk(req.params.id);
    
    if (!droit) {
      return res.status(404).json({ message: `Droit avec l'ID ${req.params.id} non trouvé` });
    }

    // Valider la requête
    if (!req.body.libelle) {
      return res.status(400).json({ message: 'Le libellé du droit est requis' });
    }

    // Mettre à jour le droit
    await droit.update({
      libelle: req.body.libelle
    });
    
    res.status(200).json({ message: 'Droit mis à jour avec succès', droit });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du droit', error: error.message });
  }
};

// Supprimer un droit
exports.delete = async (req, res) => {
  try {
    const droit = await Droit.findByPk(req.params.id);
    
    if (!droit) {
      return res.status(404).json({ message: `Droit avec l'ID ${req.params.id} non trouvé` });
    }

    // Vérifier si des utilisateurs utilisent ce droit
    const usersCount = await db.User.count({ where: { id_droit: req.params.id } });
    
    if (usersCount > 0) {
      return res.status(400).json({ 
        message: 'Impossible de supprimer ce droit car il est utilisé par des utilisateurs',
        usersCount
      });
    }

    await droit.destroy();
    
    res.status(200).json({ message: 'Droit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du droit', error: error.message });
  }
};