const dbConfig = require('../config/db.config.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importer les modèles
db.User = require('./userModel.js')(sequelize, Sequelize);
db.Droit = require('./droitModel.js')(sequelize, Sequelize);
db.Competence = require('./competenceModel.js')(sequelize, Sequelize);
db.Chantier = require('./chantierModel.js')(sequelize, Sequelize);
db.Affectation = require('./affectationModel.js')(sequelize, Sequelize);
db.Planning = require('./planningModel.js')(sequelize, Sequelize);
db.UserCompetence = require('./userCompetenceModel.js')(sequelize, Sequelize);

// Définir les relations
db.User.belongsTo(db.Droit, { foreignKey: 'id_droit' });
db.Droit.hasMany(db.User, { foreignKey: 'id_droit' });

db.User.belongsToMany(db.Competence, { 
  through: db.UserCompetence,
  foreignKey: 'id_utilisateur',
  otherKey: 'id_competence'
});
db.Competence.belongsToMany(db.User, { 
  through: db.UserCompetence,
  foreignKey: 'id_competence',
  otherKey: 'id_utilisateur'
});

db.User.belongsToMany(db.Chantier, { 
  through: db.Affectation,
  foreignKey: 'id_utilisateur',
  otherKey: 'id_chantier'
});
db.Chantier.belongsToMany(db.User, { 
  through: db.Affectation,
  foreignKey: 'id_chantier',
  otherKey: 'id_utilisateur'
});

db.User.belongsToMany(db.Chantier, { 
  through: db.Planning,
  foreignKey: 'id_utilisateur',
  otherKey: 'id_chantier',
  as: 'PlanningChantiers'
});
db.Chantier.belongsToMany(db.User, { 
  through: db.Planning,
  foreignKey: 'id_chantier',
  otherKey: 'id_utilisateur',
  as: 'PlanningUsers'
});

module.exports = db;