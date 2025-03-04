const db = require('../models');
const Chantier = db.Chantier;
const User = db.User;
const { Op } = db.Sequelize;

// Récupérer tous les chantiers
exports.findAll = async (req, res) => {
  try {
    const { nom, statut, dateDebut, dateFin } = req.query;
    let condition = {};

    if (nom) {
      condition.nom = { [Op.like]: `%${nom}%` };
    }
    if (statut) {
      condition.statut = statut;
    }
    if (dateDebut) {
      condition.date_deb = { [Op.gte]: dateDebut };
    }
    if (dateFin) {
      condition.date_fin = { [Op.lte]: dateFin };
    }

    const chantiers = await Chantier.findAll({
      where: condition,
      include: [{
        model: User,
        attributes: ['id', 'nom', 'prenom'],
        through: { attributes: ['date', 'role'] }
      }]
    });
    
    res.status(200).json(chantiers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des chantiers', error: error.message });
  }
};

// Récupérer un chantier par son ID
exports.findOne = async (req, res) => {
  try {
    const chantier = await Chantier.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['id', 'nom', 'prenom', 'email'],
        through: { attributes: ['date', 'role'] }
      }]
    });
    
    if (!chantier) {
      return res.status(404).json({ message: `Chantier avec l'ID ${req.params.id} non trouvé` });
    }
    
    res.status(200).json(chantier);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du chantier', error: error.message });
  }
};

// Créer un nouveau chantier
exports.create = async (req, res) => {
  try {
    // Valider la requête
    if (!req.body.nom || !req.body.date_deb || !req.body.adresse) {
      return res.status(400).json({ 
        message: 'Les champs nom, date_deb et adresse sont requis'
      });
    }

    // Créer le chantier
    const chantier = await Chantier.create({
      nom: req.body.nom,
      description: req.body.description,
      date_deb: req.body.date_deb,
      date_fin: req.body.date_fin,
      adresse: req.body.adresse,
      statut: req.body.statut || 'planifié'
    });
    
    // Ajouter les utilisateurs affectés si fournis
    if (req.body.utilisateurs && Array.isArray(req.body.utilisateurs)) {
      for (const user of req.body.utilisateurs) {
        await db.Affectation.create({
          id_utilisateur: user.id,
          id_chantier: chantier.id,
          date: new Date(),
          role: user.role || null
        });
      }
    }
    
    res.status(201).json(chantier);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du chantier', error: error.message });
  }
};

// Mettre à jour un chantier
exports.update = async (req, res) => {
  try {
    const chantier = await Chantier.findByPk(req.params.id);
    
    if (!chantier) {
      return res.status(404).json({ message: `Chantier avec l'ID ${req.params.id} non trouvé` });
    }

    // Mettre à jour le chantier
    await chantier.update({
      nom: req.body.nom || chantier.nom,
      description: req.body.description !== undefined ? req.body.description : chantier.description,
      date_deb: req.body.date_deb || chantier.date_deb,
      date_fin: req.body.date_fin !== undefined ? req.body.date_fin : chantier.date_fin,
      adresse: req.body.adresse || chantier.adresse,
      statut: req.body.statut || chantier.statut
    });
    
    // Mettre à jour les utilisateurs affectés si fournis
    if (req.body.utilisateurs && Array.isArray(req.body.utilisateurs)) {
      // Supprimer les anciennes affectations
      await db.Affectation.destroy({
        where: { id_chantier: chantier.id }
      });

      // Ajouter les nouvelles affectations
      for (const user of req.body.utilisateurs) {
        await db.Affectation.create({
          id_utilisateur: user.id,
          id_chantier: chantier.id,
          date: new Date(),
          role: user.role || null
        });
      }
    }
    
    res.status(200).json({ message: 'Chantier mis à jour avec succès', chantier });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du chantier', error: error.message });
  }
};

// Supprimer un chantier
exports.delete = async (req, res) => {
  try {
    const chantier = await Chantier.findByPk(req.params.id);
    
    if (!chantier) {
      return res.status(404).json({ message: `Chantier avec l'ID ${req.params.id} non trouvé` });
    }

    await chantier.destroy();
    
    res.status(200).json({ message: 'Chantier supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du chantier', error: error.message });
  }
};

// Récupérer les chantiers en cours
exports.findInProgress = async (req, res) => {
  try {
    const today = new Date();
    
    const chantiers = await Chantier.findAll({
      where: {
        date_deb: { [Op.lte]: today },
        [Op.or]: [
          { date_fin: { [Op.gte]: today } },
          { date_fin: null }
        ],
        statut: 'en cours'
      },
      include: [{
        model: User,
        attributes: ['id', 'nom', 'prenom'],
        through: { attributes: ['date', 'role'] }
      }]
    });
    
    res.status(200).json(chantiers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des chantiers en cours', error: error.message });
  }
};

// Récupérer les chantiers à venir
exports.findUpcoming = async (req, res) => {
  try {
    const today = new Date();
    
    const chantiers = await Chantier.findAll({
      where: {
        date_deb: { [Op.gt]: today },
        statut: 'planifié'
      },
      include: [{
        model: User,
        attributes: ['id', 'nom', 'prenom'],
        through: { attributes: ['date', 'role'] }
      }]
    });
    
    res.status(200).json(chantiers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des chantiers à venir', error: error.message });
  }
};

// Récupérer les chantiers terminés
exports.findCompleted = async (req, res) => {
  try {
    const chantiers = await Chantier.findAll({
      where: {
        statut: 'terminé'
      },
      include: [{
        model: User,
        attributes: ['id', 'nom', 'prenom'],
        through: { attributes: ['date', 'role'] }
      }]
    });
    
    res.status(200).json(chantiers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des chantiers terminés', error: error.message });
  }
};

// Affecter un utilisateur à un chantier
exports.affectUser = async (req, res) => {
  try {
    const { id_utilisateur, role } = req.body;
    const id_chantier = req.params.id;
    
    if (!id_utilisateur) {
      return res.status(400).json({ message: 'L\'ID de l\'utilisateur est requis' });
    }
    
    // Vérifier si le chantier existe
    const chantier = await Chantier.findByPk(id_chantier);
    if (!chantier) {
      return res.status(404).json({ message: `Chantier avec l'ID ${id_chantier} non trouvé` });
    }
    
    // Vérifier si l'utilisateur existe
    const user = await User.findByPk(id_utilisateur);
    if (!user) {
      return res.status(404).json({ message: `Utilisateur avec l'ID ${id_utilisateur} non trouvé` });
    }
    
    // Vérifier si l'affectation existe déjà
    const existingAffectation = await db.Affectation.findOne({
      where: {
        id_utilisateur,
        id_chantier
      }
    });
    
    if (existingAffectation) {
      return res.status(400).json({ message: 'Cet utilisateur est déjà affecté à ce chantier' });
    }
    
    // Créer l'affectation
    const affectation = await db.Affectation.create({
      id_utilisateur,
      id_chantier,
      date: new Date(),
      role: role || null
    });
    
    res.status(201).json({
      message: 'Utilisateur affecté au chantier avec succès',
      affectation
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'affectation de l\'utilisateur au chantier', error: error.message });
  }
};

// Retirer un utilisateur d'un chantier
exports.removeUser = async (req, res) => {
  try {
    const id_chantier = req.params.id;
    const id_utilisateur = req.params.userId;
    
    // Vérifier si l'affectation existe
    const affectation = await db.Affectation.findOne({
      where: {
        id_utilisateur,
        id_chantier
      }
    });
    
    if (!affectation) {
      return res.status(404).json({ message: 'Affectation non trouvée' });
    }
    
    // Supprimer l'affectation
    await affectation.destroy();
    
    res.status(200).json({ message: 'Utilisateur retiré du chantier avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du retrait de l\'utilisateur du chantier', error: error.message });
  }
};