create database db_printerest;
use db_printerest;


create table `user` (
	`user_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `fullname` varchar(255) NOT NULL,
    `age` int,
    `avatar` varchar(255)
);

create table `image` (
	`image_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(255) NOT NULL,
    `path` mediumtext NOT NULL,
    `description` varchar(512),
    `user_id` int NOT NULL,
     CONSTRAINT `image_user_fk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
);

create table `comment` (
	`comment_id` int not null auto_increment PRIMARY KEY,
	`user_id` int NOT NULL,
    `image_id` int NOT NULL,
    `content` varchar(512) NOT NULL,
    `comment_date` datetime NOT NULL,
	CONSTRAINT `comment_user_fk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
	CONSTRAINT `image_image_fk_1` FOREIGN KEY (`image_id`) REFERENCES `image` (`image_id`)
);

create table `save_image` (
	`save_id` int not null auto_increment PRIMARY KEY,
	`user_id` int NOT NULL,
    `image_id` int NOT NULL,
    `save_date` datetime NOT NULL,
	CONSTRAINT `save_user_fk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
	CONSTRAINT `save_image_fk_1` FOREIGN KEY (`image_id`) REFERENCES `image` (`image_id`)
);