module.exports = (sequelize, Sequelize) => {
  const Droit = sequelize.define('droit', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    libelle: {
      type: Sequelize.STRING(100),
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'droit'
  });

  return Droit;
};