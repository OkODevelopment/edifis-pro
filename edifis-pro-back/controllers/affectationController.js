const db = require('../models');
const Affectation = db.Affectation;
const User = db.User;
const Chantier = db.Chantier;

// Récupérer toutes les affectations
exports.findAll = async (req, res) => {
  try {
    const affectations = await Affectation.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nom', 'prenom', 'email']
        },
        {
          model: Chantier,
          as: 'chantier',
          attributes: ['id', 'nom', 'date_deb', 'date_fin', 'adresse', 'statut']
        }
      ]
    });
    
    res.status(200).json(affectations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des affectations', error: error.message });
  }
};

// Récupérer une affectation par son ID
exports.findOne = async (req, res) => {
  try {
    const affectation = await Affectation.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nom', 'prenom', 'email']
        },
        {
          model: Chantier,
          as: 'chantier',
          attributes: ['id', 'nom', 'date_deb', 'date_fin', 'adresse', 'statut']
        }
      ]
    });
    
    if (!affectation) {
      return res.status(404).json({ message: `Affectation avec l'ID ${req.params.id} non trouvée` });
    }
    
    res.status(200).json(affectation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'affectation', error: error.message });
  }
};

// Créer une nouvelle affectation
exports.create = async (req, res) => {
  try {
    const { id_utilisateur, id_chantier, date, role } = req.body;
    
    // Valider la requête
    if (!id_utilisateur || !id_chantier || !date) {
      return res.status(400).json({ 
        message: 'Les champs id_utilisateur, id_chantier et date sont requis'
      });
    }
    
    // Vérifier si l'utilisateur existe
    const user = await User.findByPk(id_utilisateur);
    if (!user) {
      return res.status(404).json({ message: `Utilisateur avec l'ID ${id_utilisateur} non trouvé` });
    }
    
    // Vérifier si le chantier existe
    const chantier = await Chantier.findByPk(id_chantier);
    if (!chantier) {
      return res.status(404).json({ message: `Chantier avec l'ID ${id_chantier} non trouvé` });
    }
    
    // Vérifier si l'affectation existe déjà
    const existingAffectation = await Affectation.findOne({
      where: {
        id_utilisateur,
        id_chantier
      }
    });
    
    if (existingAffectation) {
      return res.status(400).json({ message: 'Cet utilisateur est déjà affecté à ce chantier' });
    }
    
    // Créer l'affectation
    const affectation = await Affectation.create({
      id_utilisateur,
      id_chantier,
      date,
      role
    });
    
    res.status(201).json(affectation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'affectation', error: error.message });
  }
};

// Mettre à jour une affectation
exports.update = async (req, res) => {
  try {
    const affectation = await Affectation.findByPk(req.params.id);
    
    if (!affectation) {
      return res.status(404).json({ message: `Affectation avec l'ID ${req.params.id} non trouvée` });
    }
    
    // Mettre à jour l'affectation
    await affectation.update({
      date: req.body.date || affectation.date,
      role: req.body.role !== undefined ? req.body.role : affectation.role
    });
    
    res.status(200).json({ message: 'Affectation mise à jour avec succès', affectation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'affectation', error: error.message });
  }
};

// Supprimer une affectation
exports.delete = async (req, res) => {
  try {
    const affectation = await Affectation.findByPk(req.params.id);
    
    if (!affectation) {
      return res.status(404).json({ message: `Affectation avec l'ID ${req.params.id} non trouvée` });
    }
    
    await affectation.destroy();
    
    res.status(200).json({ message: 'Affectation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'affectation', error: error.message });
  }
};

// Récupérer les affectations par utilisateur
exports.findByUser = async (req, res) => {
  try {
    const id_utilisateur = req.params.userId;

    const affectations = await Affectation.findAll({
      where: { id_utilisateur },
      include: [
        {
          model: db.Chantier,  // Utilise bien le modèle importé
          as: 'chantier',      // Doit correspondre au "as" défini dans la relation
          attributes: ['id', 'nom', 'adresse']
        }
      ]
    });

    res.status(200).json(affectations);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des affectations par utilisateur', 
      error: error.message 
    });
  }
};

// Récupérer les affectations par chantier
exports.findByChantier = async (req, res) => {
  try {
    const id_chantier = req.params.chantierId;
    
    const affectations = await Affectation.findAll({
      where: { id_chantier },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nom', 'prenom', 'email']
        }
      ]
    });
    
    res.status(200).json(affectations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des affectations par chantier', error: error.message });
  }
};