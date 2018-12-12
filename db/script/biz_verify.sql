DROP TABLE IF EXISTS `biz_verify`;
CREATE TABLE `biz_verify` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL,
  `biz_id` bigint(11) NOT NULL,
  `biz_lic_img` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `biz_lic_num` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `org_lic_img` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `org_lic_num` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tax_lic_img` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tax_lic_num` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_lic_img` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_lic_num` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trans_lic_img` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trans_lic_num` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner_lic_img1` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner_lic_img2` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner_lic_num` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `op_user` bigint(11) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
alter table biz_verify add constraint biz_user_verify_unique unique (`user_id`);