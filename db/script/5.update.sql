alter table biz_info add ship_biz_code varchar(100) DEFAULT NULL;
alter table user_info add remark varchar(100) DEFAULT NULL;
alter table user_info drop INDEX phone_unique ;

alter table core_biz add bonus_point bigint(10) DEFAULT 0 after status;
alter table core_biz add order_interval int(4) DEFAULT 0 after bonus_point;
alter table biz_info add ip_info varchar(40) DEFAULT NULL after status;