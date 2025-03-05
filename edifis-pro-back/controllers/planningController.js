const db = require('../models');
const Planning = db.Planning;
const User = db.User;
const Chantier = db.Chantier;
const { Op } = db.Sequelize;

// Récupérer tous les plannings
exports.findAll = async (req, res) => {
  try {
    const { dateDebut, dateFin, userId, chantierId } = req.query;
    let condition = {};

    if (dateDebut) {
      condition.date_deb = { [Op.gte]: new Date(dateDebut) };
    }
    if (dateFin) {
      condition.date_fin = { [Op.lte]: new Date(dateFin) };
    }
    if (userId) {
      condition.id_utilisateur = userId;
    }
    if (chantierId) {
      condition.id_chantier = chantierId;
    }

    console.log("Condition de recherche :", condition); // Ajoutez ce log

    const plannings = await Planning.findAll({
      where: condition,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nom', 'prenom', 'email']
        },
        {
          model: Chantier,
          as: 'chantier',
          attributes: ['id', 'nom', 'adresse', 'statut']
        }
      ]
    });

    res.status(200).json(plannings);
  } catch (error) {
    console.error("Erreur lors de la récupération des plannings :", error); // Ajoutez ce log
    res.status(500).json({ message: 'Erreur lors de la récupération des plannings', error: error.message });
  }
};

// Récupérer un planning par son ID
exports.findOne = async (req, res) => {
  try {
    const planning = await Planning.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nom', 'prenom', 'email']
        },
        {
          model: Chantier,
          as: 'chantier',
          attributes: ['id', 'nom', 'adresse', 'statut']
        }
      ]
    });
    
    if (!planning) {
      return res.status(404).json({ message: `Planning avec l'ID ${req.params.id} non trouvé` });
    }
    
    res.status(200).json(planning);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du planning', error: error.message });
  }
};

// Créer un nouveau planning
exports.create = async (req, res) => {
  try {
    const { id_utilisateur, id_chantier, date_deb, date_fin, titre, description } = req.body;
    
    // Valider la requête
    if (!id_utilisateur || !id_chantier || !date_deb || !date_fin) {
      return res.status(400).json({ 
        message: 'Les champs id_utilisateur, id_chantier, date_deb et date_fin sont requis'
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
    
    // Vérifier si l'utilisateur est déjà planifié sur cette période
    const existingPlanning = await Planning.findOne({
      where: {
        id_utilisateur,
        [Op.or]: [
          {
            date_deb: { [Op.between]: [date_deb, date_fin] }
          },
          {
            date_fin: { [Op.between]: [date_deb, date_fin] }
          },
          {
            [Op.and]: [
              { date_deb: { [Op.lte]: date_deb } },
              { date_fin: { [Op.gte]: date_fin } }
            ]
          }
        ]
      }
    });
    
    if (existingPlanning) {
      return res.status(400).json({ 
        message: 'L\'utilisateur est déjà planifié sur cette période',
        conflit: existingPlanning
      });
    }
    
    // Créer le planning
    const planning = await Planning.create({
      id_utilisateur,
      id_chantier,
      date_deb,
      date_fin,
      titre,
      description
    });
    
    res.status(201).json(planning);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du planning', error: error.message });
  }
};

// Mettre à jour un planning
exports.update = async (req, res) => {
  try {
    const planning = await Planning.findByPk(req.params.id);
    
    if (!planning) {
      return res.status(404).json({ message: `Planning avec l'ID ${req.params.id} non trouvé` });
    }
    
    const { date_deb, date_fin, titre, description } = req.body;
    
    // Vérifier les conflits si les dates sont modifiées
    if ((date_deb && date_deb !== planning.date_deb) || (date_fin && date_fin !== planning.date_fin)) {
      const newDateDeb = date_deb || planning.date_deb;
      const newDateFin = date_fin || planning.date_fin;
      
      const existingPlanning = await Planning.findOne({
        where: {
          id: { [Op.ne]: planning.id },
          id_utilisateur: planning.id_utilisateur,
          [Op.or]: [
            {
              date_deb: { [Op.between]: [newDateDeb, newDateFin] }
            },
            {
              date_fin: { [Op.between]: [newDateDeb, newDateFin] }
            },
            {
              [Op.and]: [
                { date_deb: { [Op.lte]: newDateDeb } },
                { date_fin: { [Op.gte]: newDateFin } }
              ]
            }
          ]
        }
      });
      
      if (existingPlanning) {
        return res.status(400).json({ 
          message: 'L\'utilisateur est déjà planifié sur cette période',
          conflit: existingPlanning
        });
      }
    }
    
    // Mettre à jour le planning
    await planning.update({
      date_deb: date_deb || planning.date_deb,
      date_fin: date_fin || planning.date_fin,
      titre: titre !== undefined ? titre : planning.titre,
      description: description !== undefined ? description : planning.description
    });
    
    res.status(200).json({ message: 'Planning mis à jour avec succès', planning });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du planning', error: error.message });
  }
};

// Supprimer un planning
exports.delete = async (req, res) => {
  try {
    const planning = await Planning.findByPk(req.params.id);
    
    if (!planning) {
      return res.status(404).json({ message: `Planning avec l'ID ${req.params.id} non trouvé` });
    }
    
    await planning.destroy();
    
    res.status(200).json({ message: 'Planning supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du planning', error: error.message });
  }
};

// Récupérer les plannings par utilisateur
exports.findByUser = async (req, res) => {
  try {
    const id_utilisateur = req.params.userId;
    const { dateDebut, dateFin } = req.query;
    let condition = { id_utilisateur };

    if (dateDebut) {
      condition.date_deb = { [Op.gte]: new Date(dateDebut) };
    }
    if (dateFin) {
      condition.date_fin = { [Op.lte]: new Date(dateFin) };
    }
    
    const plannings = await Planning.findAll({
      where: condition,
      include: [
        {
          model: Chantier,
          as: 'chantier',
          attributes: ['id', 'nom', 'adresse', 'statut']
        }
      ]
    });
    
    res.status(200).json(plannings);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des plannings par utilisateur', error: error.message });
  }
};

// Récupérer les plannings par chantier
exports.findByChantier = async (req, res) => {
  try {
    const id_chantier = req.params.chantierId;
    const { dateDebut, dateFin } = req.query;
    let condition = { id_chantier };

    if (dateDebut) {
      condition.date_deb = { [Op.gte]: new Date(dateDebut) };
    }
    if (dateFin) {
      condition.date_fin = { [Op.lte]: new Date(dateFin) };
    }
    
    const plannings = await Planning.findAll({
      where: condition,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nom', 'prenom', 'email']
        }
      ]
    });
    
    res.status(200).json(plannings);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des plannings par chantier', error: error.message });
  }
};

// Récupérer les plannings pour la semaine en cours
exports.findCurrentWeek = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    const plannings = await Planning.findAll({
      where: {
        [Op.or]: [
          {
            date_deb: { [Op.between]: [startOfWeek, endOfWeek] }
          },
          {
            date_fin: { [Op.between]: [startOfWeek, endOfWeek] }
          },
          {
            [Op.and]: [
              { date_deb: { [Op.lte]: startOfWeek } },
              { date_fin: { [Op.gte]: endOfWeek } }
            ]
          }
        ]
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nom', 'prenom']
        },
        {
          model: Chantier,
          as: 'chantier',
          attributes: ['id', 'nom', 'adresse']
        }
      ]
    });
    
    res.status(200).json(plannings);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des plannings de la semaine', error: error.message });
  }
};