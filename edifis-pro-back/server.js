const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à la base de données
const db = require('./models');

// Synchroniser la base de données
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de données synchronisée');
  })
  .catch((err) => {
    console.error('Erreur lors de la synchronisation de la base de données:', err);
  });

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/droits', require('./routes/droitRoutes'));
app.use('/api/competences', require('./routes/competenceRoutes'));
app.use('/api/chantiers', require('./routes/chantierRoutes'));
app.use('/api/affectations', require('./routes/affectationRoutes'));
app.use('/api/plannings', require('./routes/planningRoutes'));
app.use('/api/user-competences', require('./routes/userCompetenceRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Route par défaut
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Edifis Pro' });
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});