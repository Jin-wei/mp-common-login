-- ----------------------------
--  Table structure for `core_biz_subscribe`
-- ----------------------------
DROP TABLE IF EXISTS `core_biz`;
CREATE TABLE `core_biz` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `port_id` bigint(11) NOT NULL,
  `port_name` varchar(40) NOT NULL,
  `state_id` bigint(10) NOT NULL,
  `state_name` varchar(40) NOT NULL,
  `city_id` bigint(10) NOT NULL,
  `city_name` varchar(40) NOT NULL,
  `biz_id` bigint(11) NOT NULL,
  `biz_name` varchar(40) NOT NULL,
  `grade` decimal(8,4) DEFAULT 0,
  `lock_value` decimal(8,4) DEFAULT 0,
  `priority` tinyint(1) DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

alter table `core_biz` add INDEX `core_port_uk` (`port_id`);
alter table `core_biz` add INDEX `core_state_uk` (`state_id`);
alter table `core_biz` add INDEX `core_city_uk` (`city_id`);
alter table `core_biz` add INDEX `core_biz_uk` (`biz_id`);
