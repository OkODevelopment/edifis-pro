const db = require('../models');
const Competence = db.Competence;
const { Op } = db.Sequelize;

// Récupérer toutes les compétences
exports.findAll = async (req, res) => {
  try {
    const { libelle } = req.query;
    let condition = {};

    if (libelle) {
      condition.libelle = { [Op.like]: `%${libelle}%` };
    }

    const competences = await Competence.findAll({ where: condition });
    res.status(200).json(competences);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des compétences', error: error.message });
  }
};

// Récupérer une compétence par son ID
exports.findOne = async (req, res) => {
  try {
    const competence = await Competence.findByPk(req.params.id, {
      include: [{
        model: db.User,
        attributes: ['id', 'nom', 'prenom', 'email'],
        through: { attributes: ['niveau'] }
      }]
    });
    
    if (!competence) {
      return res.status(404).json({ message: `Compétence avec l'ID ${req.params.id} non trouvée` });
    }
    
    res.status(200).json(competence);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la compétence', error: error.message });
  }
};

// Créer une nouvelle compétence
exports.create = async (req, res) => {
  try {
    // Valider la requête
    if (!req.body.libelle) {
      return res.status(400).json({ message: 'Le libellé de la compétence est requis' });
    }

    // Vérifier si la compétence existe déjà
    const existingCompetence = await Competence.findOne({
      where: { libelle: req.body.libelle }
    });

    if (existingCompetence) {
      return res.status(400).json({ message: 'Cette compétence existe déjà' });
    }

    // Créer la compétence
    const competence = await Competence.create({
      libelle: req.body.libelle
    });
    
    res.status(201).json(competence);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la compétence', error: error.message });
  }
};

// Mettre à jour une compétence
exports.update = async (req, res) => {
  try {
    const competence = await Competence.findByPk(req.params.id);
    
    if (!competence) {
      return res.status(404).json({ message: `Compétence avec l'ID ${req.params.id} non trouvée` });
    }

    // Valider la requête
    if (!req.body.libelle) {
      return res.status(400).json({ message: 'Le libellé de la compétence est requis' });
    }

    // Vérifier si le nouveau libellé existe déjà pour une autre compétence
    if (req.body.libelle !== competence.libelle) {
      const existingCompetence = await Competence.findOne({
        where: { 
          libelle: req.body.libelle,
          id: { [Op.ne]: req.params.id }
        }
      });

      if (existingCompetence) {
        return res.status(400).json({ message: 'Cette compétence existe déjà' });
      }
    }

    // Mettre à jour la compétence
    await competence.update({
      libelle: req.body.libelle
    });
    
    res.status(200).json({ message: 'Compétence mise à jour avec succès', competence });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la compétence', error: error.message });
  }
};

// Supprimer une compétence
exports.delete = async (req, res) => {
  try {
    const competence = await Competence.findByPk(req.params.id);
    
    if (!competence) {
      return res.status(404).json({ message: `Compétence avec l'ID ${req.params.id} non trouvée` });
    }

    await competence.destroy();
    
    res.status(200).json({ message: 'Compétence supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la compétence', error: error.message });
  }
};

// Récupérer les utilisateurs ayant une compétence spécifique
exports.findUsers = async (req, res) => {
  try {
    const competence = await Competence.findByPk(req.params.id, {
      include: [{
        model: db.User,
        attributes: ['id', 'nom', 'prenom', 'email'],
        through: { attributes: ['niveau'] }
      }]
    });
    
    if (!competence) {
      return res.status(404).json({ message: `Compétence avec l'ID ${req.params.id} non trouvée` });
    }
    
    res.status(200).json(competence.users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
  }
};