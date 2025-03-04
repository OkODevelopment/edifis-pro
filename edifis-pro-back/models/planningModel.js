module.exports = (sequelize, Sequelize) => {
  const Planning = sequelize.define('planning', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_utilisateur: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    id_chantier: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    date_deb: {
      type: Sequelize.DATE,
      allowNull: false
    },
    date_fin: {
      type: Sequelize.DATE,
      allowNull: false
    },
    titre: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'planning'
  });

  return Planning;
};