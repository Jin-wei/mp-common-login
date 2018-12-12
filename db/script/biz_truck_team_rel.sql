-- ----------------------------
--  Table structure for `biz_truck_team_rel`
-- ----------------------------
DROP TABLE IF EXISTS `biz_truck_team_rel`;
CREATE TABLE `biz_truck_team_rel` (
  `biz_id` bigint(11) NOT NULL,
  `truck_biz_id` bigint(11) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`biz_id`,`truck_biz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;