# ************************************************************
# Sequel Ace SQL dump
# Version 20093
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: localhost (MySQL 11.7.2-MariaDB)
# Database: restaurant_app
# Generation Time: 2025-05-20 14:20:19 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table reservations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `reservations`;

CREATE TABLE `reservations` (
  `reservation_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `people_count` int(11) NOT NULL,
  PRIMARY KEY (`reservation_id`),
  KEY `user_id` (`user_id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;

INSERT INTO `reservations` (`reservation_id`, `user_id`, `restaurant_id`, `date`, `time`, `people_count`)
VALUES
	(85,39,6,'2025-05-31','22:35:00',2),
	(88,37,1,'2025-05-25','21:30:00',5),
	(89,38,3,'2025-05-01','20:00:00',3),
	(90,38,3,'2025-05-01','20:00:00',10);

/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table restaurants
# ------------------------------------------------------------

DROP TABLE IF EXISTS `restaurants`;

CREATE TABLE `restaurants` (
  `restaurant_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;

INSERT INTO `restaurants` (`restaurant_id`, `name`, `location`, `description`)
VALUES
	(1,'Eστιατόριο Παράδεισος','Athens','Ελληνική Παραδοσιακή\n'),
	(2,'La Piazza','Athens','Ιταλική'),
	(3,'Sushi Time','Thessaloniki','Ιαπωνική'),
	(4,'Tacos House','Patra','Μεξικάνικη'),
	(5,'Burger\'s Time','Patra','Αμερικάνικη '),
	(6,'Το Νησί','Θεσσαλονίκη','Θαλασσινά & Μεσογειακή Κουζίνα');

/*!40000 ALTER TABLE `restaurants` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`user_id`, `name`, `email`, `password`)
VALUES
	(37,'test ','test@gmail.com','$2b$10$2O1fcffrClDyRTl02Tf2JOZ5m2pSOYfVx38q.clBhm3xnHM5ZG5zW'),
	(38,'john_doe','john@example.com','$2b$10$NuG7u03xR6Fv5Nnqg.cqHOhH9qVEuLF14qI8i/8knOqNffLEjPjFu'),
	(39,'123','123@gmail.com','$2b$10$iHL9MorSZ9bEwHaMaHnU/ep6S9AZrN9RWeayC5RLdp3CW6ybQvy8G'),
	(41,'john','john@gmail.com.com','$2b$10$IgwD5MK4MJcm/vKHwmbn2O.hbPRmtGP3ChfwrqBRveQUlA4YyrlpC'),
	(44,'nikos','nik@gmail.com','$2b$10$z0EqSmFXysOyZURnMrh5He4zywxKQxkUDB.AfeoYZ4/heW.cIVfuS');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
