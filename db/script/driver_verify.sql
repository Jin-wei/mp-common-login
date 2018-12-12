DROP TABLE IF EXISTS `driver_verify`;
CREATE TABLE `driver_verify` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) DEFAULT NULL,
  `biz_id` bigint(11) NOT NULL,
  `name` varchar(20)  NOT NULL,
  `gender` tinyint(1) NOT NULL DEFAULT '1',
  `phone` varchar(20)  NOT NULL,
  `truck_id` bigint(11) DEFAULT NULL,
  `res_zipcode` int(11) DEFAULT NULL,
  `res_address` varchar(200)  DEFAULT NULL,
  `lic_zipcode` int(11) DEFAULT NULL,
  `lic_type` varchar(10) DEFAULT NULL,
  `lic_date` datetime DEFAULT NULL,
  `lic_img` varchar(100)  NOT NULL,
  `lic_num` varchar(40) NOT NULL,
  `id_img1` varchar(100)  NOT NULL,
  `id_img2` varchar(100)  NOT NULL,
  `id_num` varchar(40)  DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `active` tinyint(1) DEFAULT '0',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `op_user` bigint(11) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

alter table `driver_verify` add index `driver_user_uk` (`user_id`);
alter table `driver_verify` add index `driver_biz_uk` (`biz_id`);