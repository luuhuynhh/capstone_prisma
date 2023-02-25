create database db_printerest;
use db_printerest;

`food_id` int NOT NULL AUTO_INCREMENT,
  `food_name` varchar(255) DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `price` int DEFAULT NULL,
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `type_id` int DEFAULT NULL,
  PRIMARY KEY (`food_id`),
  KEY `type_id` (`type_id`),
  CONSTRAINT `food_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `food_type` (`type_id`)

create table `user` (
	`user_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `fullname` varchar(255) NOT NULL,
    `age` int,
    `avatar` varchar(255)
)

create table `image` (
	`image_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(255) NOT NULL,
    `path` varchar(512) NOT NULL,
    `description` varchar(512),
    `user_id` int NOT NULL,
     CONSTRAINT `image_user_fk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
)

create table `comment` (
	`user_id` int NOT NULL,
    `image_id` int NOT NULL,
    `comment_date` datetime NOT NULL,
    PRIMARY KEY (`user_id`, `image_id`),
	CONSTRAINT `comment_user_fk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
	CONSTRAINT `image_image_fk_1` FOREIGN KEY (`image_id`) REFERENCES `image` (`image_id`)
)

create table `save_image` (
	`user_id` int NOT NULL,
    `image_id` int NOT NULL,
    `save_date` datetime NOT NULL,
    PRIMARY KEY (`user_id`, `image_id`),
	CONSTRAINT `save_user_fk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
	CONSTRAINT `save_image_fk_1` FOREIGN KEY (`image_id`) REFERENCES `image` (`image_id`)
)