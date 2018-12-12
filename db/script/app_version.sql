-- ----------------------------
--  Table structure for `app_version`
-- ----------------------------
DROP TABLE IF EXISTS app_version;
CREATE TABLE `app_version` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `app_type` TINYINT(1) NOT NULL DEFAULT '1',
  `app_version_name` VARCHAR(20)  COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `update_type` TINYINT(1) NOT NULL DEFAULT '0',
  `app_url` VARCHAR(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remark` VARCHAR(600) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `img_url` VARCHAR(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT '1',
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
