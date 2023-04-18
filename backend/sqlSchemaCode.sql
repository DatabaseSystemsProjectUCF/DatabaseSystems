CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(200) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `first_name` varchar(30) DEFAULT NULL,
  `last_name` varchar(30) DEFAULT NULL,
  `level_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
)

CREATE TABLE `students` (
  `id` int NOT NULL,
  `univ_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `univ_id` (`univ_id`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`),
  CONSTRAINT `student_ibfk_2` FOREIGN KEY (`univ_id`) REFERENCES `university` (`univ_id`)
) 

CREATE TABLE `s_admin` (
  `id` int NOT NULL,
  `univ_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `univ_id` (`univ_id`),
  CONSTRAINT `s_admin_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`),
  CONSTRAINT `s_admin_ibfk_2` FOREIGN KEY (`univ_id`) REFERENCES `university` (`univ_id`)
) 


CREATE TABLE `university` (
  `univ_id` int NOT NULL AUTO_INCREMENT,
  `name` char(100) DEFAULT NULL,
  `no_students` int DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `univ_email` varchar(50) NOT NULL,
  PRIMARY KEY (`univ_id`)
)

CREATE TABLE `rso` (
  `rso_id` int NOT NULL AUTO_INCREMENT,
  `id` int,
  `name` char(50) NOT NULL,
  PRIMARY KEY (`rso_id`),
  KEY `id` (`id`),
  CONSTRAINT `rso_ibfk_1` FOREIGN KEY (`id`) REFERENCES `students` (`id`)
) 

CREATE TABLE `location` (
  `loc_id` int NOT NULL AUTO_INCREMENT,
  `univ_id` int DEFAULT NULL,
  `location_name` char(50) DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  PRIMARY KEY (`loc_id`),
  KEY `univ_id` (`univ_id`),
  CONSTRAINT `location_ibfk_1` FOREIGN KEY (`univ_id`) REFERENCES `university` (`univ_id`)
)

CREATE TABLE `joins` (
  `rso_id` int NOT NULL,
  `id` int NOT NULL,
  PRIMARY KEY (`rso_id`,`id`),
  KEY `id` (`id`),
  CONSTRAINT `joins_ibfk_1` FOREIGN KEY (`id`) REFERENCES `students` (`id`),
  CONSTRAINT `joins_ibfk_2` FOREIGN KEY (`rso_id`) REFERENCES `rso` (`rso_id`)
) 

CREATE TABLE `event` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `loc_id` int DEFAULT NULL,
  `name` char(20) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `category` varchar(20) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `time` time DEFAULT NULL,
  `date` date DEFAULT NULL,
  `phone` char(10) DEFAULT NULL,
  `email` char(20) DEFAULT NULL,
  `rso_id` int DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `id` (`id`),
  KEY `loc_id` (`loc_id`),
  KEY `event_ibfk_3_idx` (`rso_id`),
  CONSTRAINT `event_ibfk_2` FOREIGN KEY (`loc_id`) REFERENCES `location` (`loc_id`),
  CONSTRAINT `event_ibfk_3` FOREIGN KEY (`rso_id`) REFERENCES `rso` (`rso_id`),
  CONSTRAINT `event_chk_1` CHECK ((`type` in (_utf8mb4'public',_utf8mb4'private',_utf8mb4'RSO')))
)


CREATE TABLE `comments` (
  comm_id int NOT NULL AUTO_INCREMENT,
  event_id int NOT NULL,
  id int NOT NULL,
  content varchar(200) DEFAULT NULL,
  rating int DEFAULT NULL,
  first_name varchar(50) DEFAULT NULL,
  last_name varchar(50) DEFAULT NULL,
  PRIMARY KEY (comm_id),
  KEY id (id),
  KEY event_id (event_id),
  CONSTRAINT comments_ibfk_1 FOREIGN KEY (id) REFERENCES students (id),
  CONSTRAINT comments_ibfk_2 FOREIGN KEY (event_id) REFERENCES event (event_id)
)
