CREATE DATABASE IF NOT EXISTS `scheduler`;
USE `scheduler`;

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` bigint(20) unsigned AUTO_INCREMENT,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `text` varchar(255) DEFAULT NULL,
  `event_pid` bigint(20) unsigned DEFAULT '0',
  `event_length` bigint(20) unsigned DEFAULT '0',
  `rec_type` varchar(25) DEFAULT '""',
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8;
