DROP TABLE IF EXISTS `truck_info`;
CREATE TABLE `truck_info` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL,
  `biz_id` bigint(11) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '1',
  `owner_name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner_id_num` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner_gender` tinyint(1) DEFAULT NULL,
  `truck_num` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `truck_lic_num` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trailer_num` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trailer_lic_num` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lic_zipcode` int(11) DEFAULT NULL,
  `trailer_lic_zipcode` int(11) DEFAULT NULL,
  `truck_lic_img` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trailer_lic_img` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `truck_lic_expired` datetime DEFAULT NULL,
  `trailer_lic_expired` datetime DEFAULT NULL,
  `insurance1_img` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurance2_img` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurance3_img` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `active` tinyint(1)  DEFAULT '0',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `op_user` bigint(11) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

alter table `truck_info` add index `truck_user_uk` (`user_id`);
alter table `truck_info` add index `truck_biz_uk` (`biz_id`);