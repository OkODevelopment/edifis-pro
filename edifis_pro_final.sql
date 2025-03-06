-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 06 mars 2025 à 16:01
-- Version du serveur : 10.4.27-MariaDB
-- Version de PHP : 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `edifis_pro`
--

-- --------------------------------------------------------

--
-- Structure de la table `affectation`
--

CREATE TABLE `affectation` (
  `id` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `id_chantier` int(11) NOT NULL,
  `date` date NOT NULL,
  `role` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `affectation`
--

INSERT INTO `affectation` (`id`, `id_utilisateur`, `id_chantier`, `date`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 2, 1, '2025-03-04', 'Chef de chantier', '2025-03-04 11:44:09', '2025-03-04 11:44:09'),
(2, 3, 2, '2025-03-04', 'Ouvrier', '2025-03-04 11:44:09', '2025-03-04 11:44:09'),
(3, 4, 3, '2025-03-04', 'Ouvrier', '2025-03-04 11:44:09', '2025-03-04 11:44:09'),
(4, 5, 1, '2025-03-04', 'Peintre', '2025-03-04 11:44:09', '2025-03-04 11:44:09'),
(5, 2, 1, '2025-03-05', 'Chef de chantier', '2025-03-04 11:44:09', '2025-03-04 11:44:09'),
(6, 3, 2, '2025-03-05', 'Ouvrier', '2025-03-04 11:44:09', '2025-03-04 11:44:09'),
(7, 4, 3, '2025-03-05', 'Ouvrier', '2025-03-04 11:44:09', '2025-03-04 11:44:09'),
(8, 5, 1, '2025-03-05', 'Peintre', '2025-03-04 11:44:09', '2025-03-04 11:44:09'),
(9, 9, 6, '2025-03-06', 'Architecte', '2025-03-04 11:44:09', '2025-03-04 11:44:09'),
(10, 10, 7, '2025-03-06', 'Électricien', '2025-03-04 11:44:09', '2025-03-04 11:44:09'),
(14, 5, 3, '2025-03-07', 'Plomberie', '2025-03-05 08:33:40', '2025-03-05 08:33:40'),
(15, 10, 5, '2025-03-20', 'Electricien', '2025-03-05 08:36:27', '2025-03-05 08:36:27'),
(16, 10, 4, '2025-03-12', 'TEST', '2025-03-05 08:48:22', '2025-03-05 08:48:22'),
(18, 4, 4, '2025-03-18', 'Plomberie', '2025-03-05 10:37:00', '2025-03-05 10:37:00'),
(19, 9, 2, '2025-03-13', 'Electricien', '2025-03-05 10:41:05', '2025-03-05 10:41:05'),
(20, 4, 5, '2025-03-12', 'Electricien', '2025-03-05 11:09:52', '2025-03-05 11:09:52'),
(22, 4, 8, '2025-03-30', 'Electricien', '2025-03-05 11:14:24', '2025-03-05 11:14:24'),
(23, 5, 4, '2025-03-18', 'Plomberie', '2025-03-05 11:16:59', '2025-03-05 11:16:59'),
(24, 18, 5, '2025-04-13', 'Electricien', '2025-03-05 11:18:53', '2025-03-05 11:18:53'),
(25, 9, 8, '2025-03-27', 'TEST', '2025-03-05 11:19:49', '2025-03-05 11:19:49');

-- --------------------------------------------------------

--
-- Structure de la table `chantier`
--

CREATE TABLE `chantier` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date_deb` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `adresse` varchar(255) NOT NULL,
  `statut` enum('planifié','en cours','terminé','annulé') DEFAULT 'planifié',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `chantier`
--

INSERT INTO `chantier` (`id`, `nom`, `description`, `date_deb`, `date_fin`, `adresse`, `statut`, `createdAt`, `updatedAt`) VALUES
(1, 'Hangar Industriel2', 'Construction d\'un hangar de stockage2', '2025-03-01', '2025-06-15', '15 rue des Industries, Bordeaux2', 'en cours', '2025-03-04 11:43:36', '2025-03-05 08:04:11'),
(2, 'Bureaux Modernes', 'Rénovation d\'un bâtiment de bureaux', '2025-02-15', '2025-05-30', '8 avenue des Affaires, Toulouse', 'en cours', '2025-03-04 11:43:36', '2025-03-04 11:43:36'),
(3, 'Magasin Central', 'Agrandissement d\'un magasin', '2025-01-10', '2025-04-20', '22 rue du Commerce, Lyon', 'en cours', '2025-03-04 11:43:36', '2025-03-04 11:43:36'),
(4, 'Entrepôt Logistique', 'Construction d\'un nouvel entrepôt', '2025-03-05', '2025-07-15', '5 boulevard Maritime, Marseille', 'planifié', '2025-03-04 11:43:36', '2025-03-04 11:43:36'),
(5, 'testnnom', 'descritpiotn', '2025-03-10', '2025-03-13', '2 square de l', 'planifié', '2025-03-04 15:52:22', '2025-03-04 15:52:22'),
(6, 'Maison Moderne', 'Construction d\'une maison moderne', '2025-03-15', '2025-06-30', '10 rue des Chênes, Paris', 'planifié', '2025-03-04 11:43:36', '2025-03-04 11:43:36'),
(7, 'Bibliothèque Municipale', 'Rénovation de la bibliothèque', '2025-04-01', '2025-07-15', '5 place de la Culture, Lille', 'planifié', '2025-03-04 11:43:36', '2025-03-04 11:43:36'),
(8, 'iuhihi', 'uihihi', '2025-03-18', '2025-03-29', 'iuuihiu', 'planifié', '2025-03-05 11:05:50', '2025-03-05 11:05:50');

-- --------------------------------------------------------

--
-- Structure de la table `competence`
--

CREATE TABLE `competence` (
  `id` int(11) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `competence`
--

INSERT INTO `competence` (`id`, `libelle`, `createdAt`, `updatedAt`) VALUES
(3, 'Plomberie', '2025-03-04 11:43:23', '2025-03-04 11:43:23'),
(4, 'Carrelage', '2025-03-04 11:43:23', '2025-03-04 11:43:23'),
(5, 'Peinture', '2025-03-04 11:43:23', '2025-03-04 11:43:23'),
(7, 'TEst', '2025-03-04 14:57:47', '2025-03-04 14:57:47');

-- --------------------------------------------------------

--
-- Structure de la table `droit`
--

CREATE TABLE `droit` (
  `id` int(11) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `droit`
--

INSERT INTO `droit` (`id`, `libelle`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', '2025-03-04 09:09:09', '2025-03-04 09:09:09'),
(2, 'chef de chantier', '2025-03-04 09:09:52', '2025-03-04 09:09:52'),
(3, 'ouvrier', '2025-03-05 12:20:41', '2025-03-05 12:20:41');

-- --------------------------------------------------------

--
-- Structure de la table `planning`
--

CREATE TABLE `planning` (
  `id` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `id_chantier` int(11) NOT NULL,
  `date_deb` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `titre` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `planning`
--

INSERT INTO `planning` (`id`, `id_utilisateur`, `id_chantier`, `date_deb`, `date_fin`, `titre`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 2, 1, '2025-03-04 08:00:00', '2025-03-04 16:00:00', 'Supervision chantier', 'Surveillance de la livraison du matériel', '2025-03-04 11:44:20', '2025-03-04 11:44:20'),
(2, 3, 2, '2025-03-04 09:00:00', '2025-03-04 17:00:00', 'Installation réseau', 'Pose du câblage électrique', '2025-03-04 11:44:20', '2025-03-04 11:44:20'),
(3, 4, 3, '2025-03-04 07:30:00', '2025-03-04 15:30:00', 'Pose de carrelage', 'Salle de pause', '2025-03-04 11:44:20', '2025-03-04 11:44:20'),
(4, 5, 1, '2025-03-04 08:00:00', '2025-03-04 16:00:00', 'Peinture', 'Peinture des murs extérieurs', '2025-03-04 11:44:20', '2025-03-04 11:44:20'),
(5, 9, 6, '2025-03-06 08:00:00', '2025-03-06 16:00:00', 'Supervision chantier', 'Surveillance de la livraison du matériel', '2025-03-04 11:44:20', '2025-03-04 11:44:20'),
(6, 10, 7, '2025-03-06 09:00:00', '2025-03-06 17:00:00', 'Installation réseau', 'Pose du câblage électrique', '2025-03-04 11:44:20', '2025-03-04 11:44:20'),
(7, 9, 7, '2025-03-06 08:00:00', '2025-03-06 16:00:00', 'Électricité', 'Installation des prises électriques', '2025-03-04 11:44:20', '2025-03-04 11:44:20');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_droit` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `nom`, `prenom`, `password`, `id_droit`, `email`, `createdAt`, `updatedAt`) VALUES
(1, 'Dupont', 'Jean', '$2b$10$z4eLfNdZYOj3.clVlBZjUOjVd2zlElk0JeaQwLqlzJFrea2YLzphO', 2, 'jean.dupont@example.com', '2025-03-04 08:17:10', '2025-03-04 08:17:10'),
(2, 'Lefevre', 'Sophie', '$2b$10$7W2ElcWCM9lXlNxF5Ug2POOxTnbmUpcVpT2FPc8w85BWEZ8eCyGom', 2, 'sophie.lefevre@example.com', '2025-03-04 11:43:45', '2025-03-04 11:43:45'),
(3, 'Moreau', 'Jean', '$2b$10$7W2ElcWCM9lXlNxF5Ug2POOxTnbmUpcVpT2FPc8w85BWEZ8eCyGom', 2, 'jean.moreau@example.com', '2025-03-04 11:43:45', '2025-03-04 11:43:45'),
(4, 'Bernard', 'Lucie', '$2b$10$7W2ElcWCM9lXlNxF5Ug2POOxTnbmUpcVpT2FPc8w85BWEZ8eCyGom', 2, 'lucie.bernard@example.com', '2025-03-04 11:43:45', '2025-03-04 11:43:45'),
(5, 'Petit', 'Thomas', '$2b$10$7W2ElcWCM9lXlNxF5Ug2POOxTnbmUpcVpT2FPc8w85BWEZ8eCyGom', 2, 'thomas.petit@example.com', '2025-03-04 11:43:45', '2025-03-04 11:43:45'),
(9, 'Martin', 'Claire', '$2b$10$7W2ElcWCM9lXlNxF5Ug2POOxTnbmUpcVpT2FPc8w85BWEZ8eCyGom', 2, 'claire.martin@example.com', '2025-03-04 11:43:45', '2025-03-04 11:43:45'),
(10, 'Durand', 'Paul', '$2b$10$7W2ElcWCM9lXlNxF5Ug2POOxTnbmUpcVpT2FPc8w85BWEZ8eCyGom', 2, 'paul.durand@example.com', '2025-03-04 11:43:45', '2025-03-04 11:43:45'),
(16, 'testnnom', 'testprenom', '$2b$10$zOTr3Rr9HncKfc7Z2io3Xe4G7V/9CwbpWfqE7/IZAuypp.RMije9S', 1, 'test@gmail.com', '2025-03-05 10:59:30', '2025-03-05 10:59:30'),
(17, 'testnnom2', 'testprenom2', '$2b$10$bOljNKxoRKvUmoPNDFukbOlXjctkFgw19Abrk1De408FrrHfb89Ea', 1, 'test2@gmail.com', '2025-03-05 11:04:21', '2025-03-05 11:04:21'),
(18, 'testnnom2', 'testprenom', '$2b$10$07vZpnIOfN7JXpVRVW7wX.42I/iXQim6rRYgqDMJE/YBsH7xO2pqG', 1, 'teslokjl@gmail.com', '2025-03-05 11:05:00', '2025-03-05 11:05:00'),
(19, 'testnnom2', 'testprenom2', '$2b$10$UKMFoNeBU5e.SxQzxcpAx./Y7kEZMYLFdPqDtEMBZYNA3vROPT542', 1, 'tesiuhiuhiuht@gmail.com', '2025-03-05 11:06:03', '2025-03-05 11:06:03'),
(20, 'emploitest', 'hjbjhbjhb', '$2b$10$XXzVUO4A9k.ul6jxWV6fXey1icKs4WQIwKaqjETvzSbrXZGJzL5hy', 3, 'ouvrier@gmail.com', '2025-03-05 11:21:57', '2025-03-05 11:21:57'),
(21, 'testouv', 'testouv', '$2b$10$dk7s/EAykkpo9wkKd4tKiu6IQu9gluPSJQVip9z7sGc37NB5A2NUC', 3, 'ouvest@gmail.com', '2025-03-05 15:17:35', '2025-03-05 15:17:35'),
(22, 'iehygbrojugebkb', 'yoghbyugbhiuy', '$2b$10$AYYBSCuhjlv2GNaBYiu4F.lmQB7wx0C09XEnUFeC.7wbQsGh8sPMi', 3, 'ouvt@gmail.com', '2025-03-05 15:42:36', '2025-03-05 15:42:36');

-- --------------------------------------------------------

--
-- Structure de la table `user_competence`
--

CREATE TABLE `user_competence` (
  `id` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `id_competence` int(11) NOT NULL,
  `niveau` int(11) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_competence`
--

INSERT INTO `user_competence` (`id`, `id_utilisateur`, `id_competence`, `niveau`, `createdAt`, `updatedAt`) VALUES
(3, 3, 3, 5, '2025-03-04 11:43:59', '2025-03-04 11:43:59'),
(4, 4, 4, 4, '2025-03-04 11:43:59', '2025-03-04 11:43:59'),
(16, 5, 4, 1, '2025-03-04 15:45:09', '2025-03-04 15:45:09'),
(17, 5, 5, 3, '2025-03-04 15:45:09', '2025-03-04 15:45:09'),
(20, 2, 3, 1, '2025-03-04 16:18:09', '2025-03-04 16:18:09'),
(21, 1, 3, 1, '2025-03-04 16:48:04', '2025-03-04 16:48:04'),
(22, 1, 5, 1, '2025-03-04 16:48:04', '2025-03-04 16:48:04'),
(24, 10, 3, 1, '2025-03-05 08:16:02', '2025-03-05 08:16:02'),
(25, 10, 5, 1, '2025-03-05 08:16:02', '2025-03-05 08:16:02'),
(32, 16, 4, 1, '2025-03-05 10:59:30', '2025-03-05 10:59:30'),
(33, 17, 3, 1, '2025-03-05 11:04:21', '2025-03-05 11:04:21'),
(34, 18, 3, 1, '2025-03-05 11:05:00', '2025-03-05 11:05:00'),
(35, 19, 4, 1, '2025-03-05 11:06:03', '2025-03-05 11:06:03'),
(36, 20, 3, 1, '2025-03-05 11:21:57', '2025-03-05 11:21:57'),
(37, 21, 3, 1, '2025-03-05 15:17:35', '2025-03-05 15:17:35'),
(38, 22, 3, 1, '2025-03-05 15:42:36', '2025-03-05 15:42:36');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `affectation`
--
ALTER TABLE `affectation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_utilisateur` (`id_utilisateur`),
  ADD KEY `id_chantier` (`id_chantier`);

--
-- Index pour la table `chantier`
--
ALTER TABLE `chantier`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `competence`
--
ALTER TABLE `competence`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `droit`
--
ALTER TABLE `droit`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `planning`
--
ALTER TABLE `planning`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_utilisateur` (`id_utilisateur`),
  ADD KEY `id_chantier` (`id_chantier`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `user_email` (`email`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD KEY `id_droit` (`id_droit`);

--
-- Index pour la table `user_competence`
--
ALTER TABLE `user_competence`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_utilisateur` (`id_utilisateur`),
  ADD KEY `id_competence` (`id_competence`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `affectation`
--
ALTER TABLE `affectation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `chantier`
--
ALTER TABLE `chantier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `competence`
--
ALTER TABLE `competence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `droit`
--
ALTER TABLE `droit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `planning`
--
ALTER TABLE `planning`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `user_competence`
--
ALTER TABLE `user_competence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `affectation`
--
ALTER TABLE `affectation`
  ADD CONSTRAINT `affectation_ibfk_131` FOREIGN KEY (`id_utilisateur`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `affectation_ibfk_132` FOREIGN KEY (`id_chantier`) REFERENCES `chantier` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `planning`
--
ALTER TABLE `planning`
  ADD CONSTRAINT `planning_ibfk_131` FOREIGN KEY (`id_utilisateur`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `planning_ibfk_132` FOREIGN KEY (`id_chantier`) REFERENCES `chantier` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`id_droit`) REFERENCES `droit` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`id_droit`) REFERENCES `droit` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `user_ibfk_3` FOREIGN KEY (`id_droit`) REFERENCES `droit` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `user_ibfk_4` FOREIGN KEY (`id_droit`) REFERENCES `droit` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `user_ibfk_5` FOREIGN KEY (`id_droit`) REFERENCES `droit` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `user_ibfk_6` FOREIGN KEY (`id_droit`) REFERENCES `droit` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Contraintes pour la table `user_competence`
--
ALTER TABLE `user_competence`
  ADD CONSTRAINT `user_competence_ibfk_131` FOREIGN KEY (`id_utilisateur`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_competence_ibfk_132` FOREIGN KEY (`id_competence`) REFERENCES `competence` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
