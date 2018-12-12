DROP TABLE IF EXISTS `user_department`;
CREATE TABLE `user_department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(100)  NOT NULL,
  `biz_id` int(11) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

alter table `user_department` add index `department_biz_uk` (`biz_id`);