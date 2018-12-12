-- ----------------------------
--  Table structure for `core_biz_config`
-- ----------------------------
DROP TABLE IF EXISTS `core_biz_config`;
CREATE TABLE `core_biz_config` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `param_name` varchar(20) DEFAULT NULL,
  `param_value` decimal(10,4) DEFAULT 0,
  `remark` varchar(20) DEFAULT NULL,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

alter table `core_biz_config` add INDEX `param_name_uk` (`param_name`);

insert into core_biz_config (param_name,param_value,remark) values('complete_weight',0.8,'订单完成率权重');
insert into core_biz_config (param_name,param_value,remark) values('feedback_weight',0.2,'平均评价分权重');
insert into core_biz_config (param_name,param_value,remark) values('prime_num',5,'核心车队数');
insert into core_biz_config (param_name,param_value,remark) values('minor_num',5,'次核心车队数');
