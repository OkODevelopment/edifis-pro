module.exports = (sequelize, Sequelize) => {
  const Affectation = sequelize.define('affectation', {
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
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    role: {
      type: Sequelize.STRING(100),
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'affectation'
  });

  return Affectation;
};