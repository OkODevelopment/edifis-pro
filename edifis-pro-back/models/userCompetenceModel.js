module.exports = (sequelize, Sequelize) => {
  const UserCompetence = sequelize.define('user_competence', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_utilisateur: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    id_competence: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    niveau: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 5
      }
    }
  }, {
    timestamps: true,
    tableName: 'user_competence'
  });

  return UserCompetence;
};