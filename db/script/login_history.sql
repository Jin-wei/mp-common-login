DROP TABLE IF EXISTS `login_history`;
CREATE TABLE `login_history` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `created_on` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`created_on`)
) partition by hash (year(created_on))
partitions 6;
