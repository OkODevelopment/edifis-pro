module.exports = (sequelize, Sequelize) => {
  const Competence = sequelize.define('competence', {
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
    tableName: 'competence'
  });

  return Competence;
};