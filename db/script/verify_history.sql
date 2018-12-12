DROP TABLE IF EXISTS `verify_history`;
CREATE TABLE `verify_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `verify_id` bigint(11) NOT NULL,
  `verify_type` tinyint(1) NOT NULL,
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verify_status` tinyint(1) NOT NULL,
  `op_user` bigint(11) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

alter table `verify_history` add index `verify_history_id_uk` (`verify_id`);
