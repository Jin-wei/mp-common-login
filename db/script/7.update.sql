alter table biz_info add column inner_flag tinyint(1) default 0 after status;
alter table biz_info add column part_id bigint(11) default null after inner_flag;

alter table truck_info add column e6_flag tinyint(1) default 0 after status;

alter table app_version add column `download_count` int(10) default 0 after status;

update region set name = '赣榆区' where id = 320721;
delete from region where id = 320705;