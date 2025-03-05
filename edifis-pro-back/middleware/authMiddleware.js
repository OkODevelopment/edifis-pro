const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token d\'authentification manquant' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [{
        model: db.Droit,
        attributes: ['libelle']
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.droit.libelle === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Accès refusé. Droits d\'administrateur requis' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const isChefChantier = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [{
        model: db.Droit,
        attributes: ['libelle']
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.droit.libelle === 'chef de chantier' || user.droit.libelle === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Accès refusé. Droits de chef de chantier requis' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const isAdminOrChefChantier = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [{
        model: db.Droit,
        attributes: ['libelle']
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.droit.libelle === 'admin' || user.droit.libelle === 'chef de chantier') {
      next();
    } else {
      return res.status(403).json({ message: 'Accès refusé. Droits d\'administrateur ou de chef de chantier requis' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isChefChantier,
  isAdminOrChefChantier
};