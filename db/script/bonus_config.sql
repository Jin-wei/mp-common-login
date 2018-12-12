-- ----------------------------
--  Table structure for `bonus_config`
-- ----------------------------
DROP TABLE IF EXISTS `bonus_config`;
CREATE TABLE `bonus_config` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `bonus_name` varchar(40) DEFAULT NULL,
  `action_name` varchar(40) DEFAULT NULL,
  `user_type` tinyint(1) DEFAULT NULL,
  `type` tinyint(1) DEFAULT 0,
  `point` bigint(10) DEFAULT 0,
  `status` tinyint(1) DEFAULT 0,
  `remark` varchar(100) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

insert into bonus_config(id,bonus_name,action_name,user_type,type,point) values(1,'委托陆运','平台订单完成',2,1,0);
insert into bonus_config(id,bonus_name,action_name,user_type,type,point) values(2,'委托订箱','平台订箱',2,1,0);
insert into bonus_config(id,bonus_name,action_name,user_type,type,point) values(3,'委托保险','平台购买货险',2,1,0);
insert into bonus_config(id,bonus_name,action_name,user_type,type,point) values(4,'注册有礼','首次注册',2,1,1000);
insert into bonus_config(id,bonus_name,action_name,user_type,type,point) values(5,'附加积分','每月下单天数>3',2,1,500);
insert into bonus_config(id,bonus_name,action_name,user_type,type,point) values(6,'首单奖励','完成首单',2,1,200);
insert into bonus_config(id,bonus_name,action_name,user_type,type,point) values(7,'评价积分','完成一条评价',2,1,200);

insert into bonus_config(id,bonus_name,action_name,user_type,type,point) values(8,'区域奖励','起止地线路指定积分',5,1,0);
insert into bonus_config(id,bonus_name,action_name,user_type,type,point) values(9,'订单数奖励','完成一个订单',5,1,200);
insert into bonus_config(id,bonus_name,action_name,user_type,type,point) values(10,'注册有礼','首次注册',5,1,1000);
insert into bonus_config(id,bonus_name,action_name,user_type,type,point) values(11,'首单奖励','完成首单',5,1,200);
insert into bonus_config(id,bonus_name,action_name,user_type,type,point) values(12,'客户投诉','货代投诉司机，确认为事实',5,1,-2000);

insert into bonus_config(id,bonus_name,action_name,user_type,type,point) values(13,'抵扣未出账单','抵扣未出账单',2,2,0);
insert into bonus_config(id,bonus_name,action_name,user_type,type,point) values(14,'取消订单回退积分','取消订单回退积分',2,2,0);