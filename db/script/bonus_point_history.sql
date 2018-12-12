-- ----------------------------
--  Table structure for `bonus_point_history`
-- ----------------------------
DROP TABLE IF EXISTS `bonus_point_history`;
CREATE TABLE `bonus_point_history` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL,
  `action_id` bigint(11) DEFAULT NULL,
  `action_name` varchar(40) DEFAULT NULL,
  `type` tinyint(1) DEFAULT 0,
  `point` bigint(10) DEFAULT 0,
  `remain_point` bigint(10) DEFAULT 0,
  `status` tinyint(1) DEFAULT 0,
  `remark` varchar(100) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
