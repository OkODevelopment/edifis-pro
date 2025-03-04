const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.User;
const Droit = db.Droit;
const Competence = db.Competence;
const { Op } = db.Sequelize;

// Récupérer tous les utilisateurs
exports.findAll = async (req, res) => {
  try {
    const { nom, prenom, role } = req.query;
    let condition = {};

    if (nom) {
      condition.nom = { [Op.like]: `%${nom}%` };
    }
    if (prenom) {
      condition.prenom = { [Op.like]: `%${prenom}%` };
    }

    let include = [
      {
        model: Droit,
        attributes: ['id', 'libelle']
      }
    ];

    if (role) {
      include = [
        {
          model: Droit,
          attributes: ['id', 'libelle'],
          where: { libelle: role }
        }
      ];
    }

    const users = await User.findAll({
      where: condition,
      attributes: { exclude: ['password'] },
      include: include
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
  }
};

// Récupérer un utilisateur par son ID
exports.findOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Droit,
          attributes: ['id', 'libelle']
        },
        {
          model: Competence,
          through: { attributes: ['niveau'] }
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: `Utilisateur avec l'ID ${req.params.id} non trouvé` });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error: error.message });
  }
};

// Créer un nouvel utilisateur
exports.create = async (req, res) => {
  try {
    // Vérifier si l'email existe déjà
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Créer l'utilisateur
    const user = await User.create({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      password: hashedPassword,
      id_droit: req.body.id_droit
    });

    // Ajouter les compétences si fournies
    if (req.body.competences && Array.isArray(req.body.competences)) {
      for (const comp of req.body.competences) {
        await db.UserCompetence.create({
          id_utilisateur: user.id,
          id_competence: comp.id,
          niveau: comp.niveau || 1
        });
      }
    }

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        id_droit: user.id_droit
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
  }
};

// Mettre à jour un utilisateur
exports.update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: `Utilisateur avec l'ID ${req.params.id} non trouvé` });
    }

    // Vérifier si l'email existe déjà pour un autre utilisateur
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ 
        where: { 
          email: req.body.email,
          id: { [Op.ne]: req.params.id }
        } 
      });
      
      if (emailExists) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé par un autre utilisateur' });
      }
    }

    // Préparer les données à mettre à jour
    const updateData = {
      nom: req.body.nom || user.nom,
      prenom: req.body.prenom || user.prenom,
      email: req.body.email || user.email,
      id_droit: req.body.id_droit || user.id_droit
    };

    // Mettre à jour le mot de passe si fourni
    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    // Mettre à jour l'utilisateur
    await user.update(updateData);

    // Mettre à jour les compétences si fournies
    if (req.body.competences && Array.isArray(req.body.competences)) {
      // Supprimer les anciennes compétences
      await db.UserCompetence.destroy({
        where: { id_utilisateur: user.id }
      });

      // Ajouter les nouvelles compétences
      for (const comp of req.body.competences) {
        await db.UserCompetence.create({
          id_utilisateur: user.id,
          id_competence: comp.id,
          niveau: comp.niveau || 1
        });
      }
    }

    res.status(200).json({ 
      message: 'Utilisateur mis à jour avec succès',
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        id_droit: user.id_droit
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error: error.message });
  }
};

// Supprimer un utilisateur
exports.delete = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: `Utilisateur avec l'ID ${req.params.id} non trouvé` });
    }

    await user.destroy();
    
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error: error.message });
  }
};

// Récupérer les utilisateurs par compétence
exports.findByCompetence = async (req, res) => {
  try {
    const competenceId = req.params.competenceId;
    
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Droit,
          attributes: ['id', 'libelle']
        },
        {
          model: Competence,
          where: { id: competenceId },
          through: { attributes: ['niveau'] }
        }
      ]
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs par compétence', error: error.message });
  }
};

// Récupérer les utilisateurs par chantier
exports.findByChantier = async (req, res) => {
  try {
    const chantierId = req.params.chantierId;
    
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Droit,
          attributes: ['id', 'libelle']
        },
        {
          model: db.Chantier,
          where: { id: chantierId },
          through: { attributes: ['date', 'role'] }
        }
      ]
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs par chantier', error: error.message });
  }
};