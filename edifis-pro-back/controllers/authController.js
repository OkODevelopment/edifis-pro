const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
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

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ 
      where: { email: req.body.email },
      include: [{
        model: db.Droit,
        attributes: ['libelle']
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.droit.libelle },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.droit.libelle
      },
      token: token
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
};

// Récupérer le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: db.Droit,
          attributes: ['libelle']
        },
        {
          model: db.Competence,
          through: { attributes: ['niveau'] }
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil', error: error.message });
  }
};

// Mettre à jour le mot de passe
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    
    // Mettre à jour le mot de passe
    await user.update({ password: hashedPassword });

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du mot de passe', error: error.message });
  }
};