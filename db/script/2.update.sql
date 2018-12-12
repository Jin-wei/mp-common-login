--10.24--
ALTER TABLE `biz_info` ADD COLUMN `email` varchar(100) DEFAULT NULL AFTER `phone`;
--10.25--
ALTER TABLE `user_info` ADD COLUMN `department_id` bigint(11) DEFAULT NULL AFTER `zipcode`;
alter table user_info add COLUMN sub_type int(11) after type;
ALTER TABLE `user_info` ADD COLUMN `p_biz_id` bigint(11) default null after sub_type;
--10.26--
ALTER TABLE `biz_info` ADD COLUMN `jur_per` varchar(20) DEFAULT NULL AFTER `operator`;
ALTER TABLE `biz_info` ADD COLUMN `cdh_code` varchar(40) DEFAULT NULL AFTER `jur_per`;
alter table admin_user modify username varchar(20);
