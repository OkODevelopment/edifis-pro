const db = require('../models');
const UserCompetence = db.UserCompetence;
const User = db.User;
const Competence = db.Competence;

// Récupérer toutes les associations utilisateur-compétence
exports.findAll = async (req, res) => {
  try {
    const userCompetences = await UserCompetence.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nom', 'prenom', 'email']
        },
        {
          model: Competence,
          as: 'competence',
          attributes: ['id', 'libelle']
        }
      ]
    });
    res.status(200).json(userCompetences);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des associations utilisateur-compétence', error: error.message });
  }
};

// Récupérer une association utilisateur-compétence par son ID
exports.findOne = async (req, res) => {
  try {
    const userCompetence = await UserCompetence.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nom', 'prenom', 'email']
        },
        {
          model: Competence,
          as: 'competence',
          attributes: ['id', 'libelle']
        }
      ]
    });
    
    if (!userCompetence) {
      return res.status(404).json({ message: `Association utilisateur-compétence avec l'ID ${req.params.id} non trouvée` });
    }
    
    res.status(200).json(userCompetence);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'association utilisateur-compétence', error: error.message });
  }
};

// Créer une nouvelle association utilisateur-compétence
exports.create = async (req, res) => {
  try {
    const { id_utilisateur, id_competence, niveau } = req.body;
    
    // Valider la requête
    if (!id_utilisateur || !id_competence) {
      return res.status(400).json({ 
        message: 'Les champs id_utilisateur et id_competence sont requis'
      });
    }
    
    // Vérifier si l'utilisateur existe
    const user = await User.findByPk(id_utilisateur);
    if (!user) {
      return res.status(404).json({ message: `Utilisateur avec l'ID ${id_utilisateur} non trouvé` });
    }
    
    // Vérifier si la compétence existe
    const competence = await Competence.findByPk(id_competence);
    if (!competence) {
      return res.status(404).json({ message: `Compétence avec l'ID ${id_competence} non trouvée` });
    }
    
    // Vérifier si l'association existe déjà
    const existingUserCompetence = await UserCompetence.findOne({
      where: {
        id_utilisateur,
        id_competence
      }
    });
    
    if (existingUserCompetence) {
      return res.status(400).json({ message: 'Cette association utilisateur-compétence existe déjà' });
    }
    
    // Créer l'association
    const userCompetence = await UserCompetence.create({
      id_utilisateur,
      id_competence,
      niveau: niveau || 1
    });
    
    res.status(201).json(userCompetence);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'association utilisateur-compétence', error: error.message });
  }
};

// Mettre à jour une association utilisateur-compétence
exports.update = async (req, res) => {
  try {
    const userCompetence = await UserCompetence.findByPk(req.params.id);
    
    if (!userCompetence) {
      return res.status(404).json({ message: `Association utilisateur-compétence avec l'ID ${req.params.id} non trouvée` });
    }
    
    // Mettre à jour l'association
    await userCompetence.update({
      niveau: req.body.niveau || userCompetence.niveau
    });
    
    res.status(200).json({ message: 'Association utilisateur-compétence mise à jour avec succès', userCompetence });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'association utilisateur-compétence', error: error.message });
  }
};

// Supprimer une association utilisateur-compétence
exports.delete = async (req, res) => {
  try {
    const userCompetence = await UserCompetence.findByPk(req.params.id);
    
    if (!userCompetence) {
      return res.status(404).json({ message: `Association utilisateur-compétence avec l'ID ${req.params.id} non trouvée` });
    }
    
    await userCompetence.destroy();
    
    res.status(200).json({ message: 'Association utilisateur-compétence supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'association utilisateur-compétence', error: error.message });
  }
};

// Récupérer les compétences d'un utilisateur
exports.findByUser = async (req, res) => {
  try {
    const id_utilisateur = req.params.userId;
    
    const userCompetences = await UserCompetence.findAll({
      where: { id_utilisateur },
      include: [
        {
          model: Competence,
          as: 'competence',
          attributes: ['id', 'libelle']
        }
      ]
    });
    
    res.status(200).json(userCompetences);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des compétences de l\'utilisateur', error: error.message });
  }
};

// Récupérer les utilisateurs ayant une compétence
exports.findByCompetence = async (req, res) => {
  try {
    const id_competence = req.params.competenceId;
    
    const userCompetences = await UserCompetence.findAll({
      where: { id_competence },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nom', 'prenom', 'email']
        }
      ]
    });
    
    res.status(200).json(userCompetences);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs ayant cette compétence', error: error.message });
  }
};

// Nouvelle méthode pour récupérer les compétences d'un utilisateur par son ID
exports.findByUserId = async (req, res) => {
  try {
    console.log("req.params.id", req.params.id)
    const id_utilisateur = req.params.id // <-- correspond à /api/user-competences/:id

    const userCompetences = await UserCompetence.findAll({
      where: { id_utilisateur },
      include: [
        {
          model: Competence,
          as: 'competence',  // Ici, Sequelize a besoin que 'competence' soit bien déclaré dans les associations.
          attributes: ['id', 'libelle']
        }
      ]
    })    

    res.status(200).json(userCompetences)
  } catch (error) {
    res.status(500).json({
      message: `Erreur lors de la récupération des compétences pour l'utilisateur ${req.params.id}`,
      error: error.message
    })
  }
}
