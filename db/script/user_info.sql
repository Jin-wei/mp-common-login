DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `gender` tinyint(1) NOT NULL DEFAULT '1',
  `avatar` varchar(200) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `state` varchar(20) DEFAULT NULL,
  `city` varchar(40) DEFAULT NULL,
  `zipcode` int(11) DEFAULT NULL,
  `wechat_id` varchar(60) DEFAULT NULL,
  `wechat_status` tinyint(1) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `type` int(11) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
alter table user_info drop CONSTRAINT phone_unique unique(phone);