-- ----------------------------
--  Table structure for `user_device`
-- ----------------------------
DROP TABLE IF EXISTS user_device;
CREATE TABLE `user_device` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) DEFAULT NULL,
  `device_token` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_type` tinyint(1) NOT NULL DEFAULT '1',
  `device_account` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sound_type` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `device_token_uk` (`device_token`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
