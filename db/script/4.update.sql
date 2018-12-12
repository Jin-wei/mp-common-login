update user_info set sub_type = 8 where type = 5;

alter table driver_verify modify biz_id bigint(11) DEFAULT NULL;
alter table driver_verify modify name varchar(20) DEFAULT NULL;
alter table driver_verify modify gender tinyint(1) DEFAULT NULL;
alter table driver_verify modify phone varchar(20)  DEFAULT NULL;
alter table driver_verify modify lic_img varchar(100) DEFAULT NULL;
alter table driver_verify modify lic_num varchar(40) DEFAULT NULL;
alter table driver_verify modify id_img1 varchar(40) DEFAULT NULL;
alter table driver_verify modify id_img2 varchar(40) DEFAULT NULL;

alter table region add column adcode bigint(11) DEFAULT NULL;

alter table region add column p_name varchar(40) DEFAULT NULL;

update region set p_name = name where pid = 0;

update region a,(select * from region b) t set a.p_name = t.name where t.id = a.pid;

alter table driver_verify modify active tinyint(1) default '1';

