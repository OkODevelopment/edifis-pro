module.exports = (sequelize, Sequelize) => {
  const Chantier = sequelize.define('chantier', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    date_deb: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    date_fin: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    adresse: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    statut: {
      type: Sequelize.ENUM('planifié', 'en cours', 'terminé', 'annulé'),
      defaultValue: 'planifié'
    }
  }, {
    timestamps: true,
    tableName: 'chantier'
  });

  return Chantier;
};