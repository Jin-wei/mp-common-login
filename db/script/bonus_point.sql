-- ----------------------------
--  Table structure for `bonus_point`
-- ----------------------------
DROP TABLE IF EXISTS `bonus_point`;
CREATE TABLE `bonus_point` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL,
  `biz_id` bigint(11) DEFAULT NULL,
  `biz_name` varchar(40) DEFAULT NULL,
  `user_type` tinyint(1) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `total_point` bigint(10) DEFAULT 0,
  `first_flag` tinyint(1) DEFAULT 0,
  `remark` varchar(100) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10003 , 10003  , '微势（厦门）供应链管理有限公司',2,'18559653813');
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10014 ,  10013 ,  '美森货代公司', 2 ,  '15840930344'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10027  , 10024 ,  '李鹏'  , 2 ,  '13793238398'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10029  , 10026 ,  '宋康'  ,  2  , '13589335517'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10031  , 10028 ,  '青岛中外运物流有限公司' ,  2 ,  '13791911277'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10032  , 10029 ,  '中外运箱满路'  ,  2   ,'15166682030'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10034  , 10031 ,  '青岛中外运储运有限公司' ,   2  , '18678935050' );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10035  , 10032 ,  '青岛箱满路货代测试账户' ,  2 ,  '18253276881'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10039  , 10036 ,  '青岛中外运物流有限公司' ,   2 ,  '13791956368'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10041  , 10037 ,  '测试货代' , 2 ,  '18905320788'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10044  , 10039 ,  '中国外运山东有限公司集装箱海运分公司',2  , '13280829683'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10045  , 10040  , '青岛中外运储运有限公司'  ,2 ,  '18678619559'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10047  , 10042 ,  '烟台中外运国际物流有限公司',  2 , '15253569188'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10050  , 10044 ,  '中国外运山东有限公司集装箱海运分公司',  2 ,  '13869866060'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10069  , 10050 ,  '外运济宁市兖州区内陆场站', 2 , '13964250652'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10070  , 10051 ,  '美森测试货代' ,  2 ,  '18642865880'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10106  , 10077 ,  '河南外运保税物流有限责任公司',  2  , '13803845801'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10109  , 10078 ,  '青岛中外运物流有限公司济宁场站', 2  , '15205375121'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10114  , 10082 ,  '箱满路货代'  ,  2 ,  '18910689791'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10138  , 10100 ,  '美森' ,  2 , '15642397052'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10143  , 10103 ,  '中国外运山东有限公司东营分公司', 2 , '15866765730'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10178  , 10130 ,  '青岛金惠源国际物流有限公司',2 , '15006580038'  );
insert into bonus_point(user_id,biz_id,biz_name,user_type,phone)values(10189  , 10134 ,  '中国外运陆桥运输有限公司',  2 ,  '18961382006' );

insert into bonus_point(user_id,user_type,phone) values(10023 ,5, 15841194024 );
insert into bonus_point(user_id,user_type,phone) values( 10040 ,5, 15820085483);
insert into bonus_point(user_id,user_type,phone) values(10042 ,5, 15621012489 );
insert into bonus_point(user_id,user_type,phone) values(10048 ,5, 18661767737 );
insert into bonus_point(user_id,user_type,phone) values(10052 , 5,13792536525 );
insert into bonus_point(user_id,user_type,phone) values(10053 , 5,13335095970 );
insert into bonus_point(user_id,user_type,phone) values( 10054 , 5,13615326366 );
insert into bonus_point(user_id,user_type,phone) values(10055 , 5,15969856297 );
insert into bonus_point(user_id,user_type,phone) values(10056 , 5,18653289017 );
insert into bonus_point(user_id,user_type,phone) values(10057 , 5,15966444163 );
insert into bonus_point(user_id,user_type,phone) values(10058 , 5,15020082168 );
insert into bonus_point(user_id,user_type,phone) values(10059 , 5,13964225586 );
insert into bonus_point(user_id,user_type,phone) values(10063 , 5,13335055683 );
insert into bonus_point(user_id,user_type,phone) values(10064 , 5,15166613966 );
insert into bonus_point(user_id,user_type,phone) values(10065 , 5,13954259915 );
insert into bonus_point(user_id,user_type,phone) values(10067 , 5,13553029350 );
insert into bonus_point(user_id,user_type,phone) values(10068 , 5,13656428607 );
insert into bonus_point(user_id,user_type,phone) values(10072 , 5,13780645582 );
insert into bonus_point(user_id,user_type,phone) values(10074 , 5,13706482722 );
insert into bonus_point(user_id,user_type,phone) values(10075 , 5,15554216737);
insert into bonus_point(user_id,user_type,phone) values(10076 , 5,13963958160 );
insert into bonus_point(user_id,user_type,phone) values(10086 , 5,13889620102 );
insert into bonus_point(user_id,user_type,phone) values(10088 , 5,13355325390 );
insert into bonus_point(user_id,user_type,phone) values(10102 , 5,15863110298 );
insert into bonus_point(user_id,user_type,phone) values(10103 , 5,13573250005 );
insert into bonus_point(user_id,user_type,phone) values(10104 , 5,15053215955 );
insert into bonus_point(user_id,user_type,phone) values(10105 , 5,18562240641 );
insert into bonus_point(user_id,user_type,phone) values(10107 , 5,15908928886 );
insert into bonus_point(user_id,user_type,phone) values(10108 , 5,13953252786);
insert into bonus_point(user_id,user_type,phone) values(10113 ,5, 13906390180 );
insert into bonus_point(user_id,user_type,phone) values(10118 , 5,15020773803 );
insert into bonus_point(user_id,user_type,phone) values(10133 , 5,18605477066 );
insert into bonus_point(user_id,user_type,phone) values(10134 ,5, 13562710428 );
insert into bonus_point(user_id,user_type,phone) values(10135 , 5,18454727999 );
insert into bonus_point(user_id,user_type,phone) values(10139 , 5,15615666715 );
insert into bonus_point(user_id,user_type,phone) values(10140 , 5,13371079778 );
insert into bonus_point(user_id,user_type,phone) values(10148 ,5, 15166682030 );
insert into bonus_point(user_id,user_type,phone) values(10150 , 5,13335027470 );
insert into bonus_point(user_id,user_type,phone) values(10151 ,5, 18005427303 );
insert into bonus_point(user_id,user_type,phone) values(10152 , 5,15315423365 );
insert into bonus_point(user_id,user_type,phone) values(10161 , 5,18554867737 );
insert into bonus_point(user_id,user_type,phone) values(10162 ,5, 18606307557 );
insert into bonus_point(user_id,user_type,phone) values(10163 , 5,18863132967 );
insert into bonus_point(user_id,user_type,phone) values(10164 ,5, 13906313801 );
insert into bonus_point(user_id,user_type,phone) values(10168 ,5, 13280976237 );
insert into bonus_point(user_id,user_type,phone) values(10171 , 5,13371493992 );
insert into bonus_point(user_id,user_type,phone) values(10172 ,5, 15069344177 );
insert into bonus_point(user_id,user_type,phone) values(10177 ,5, 13105136816 );
insert into bonus_point(user_id,user_type,phone) values(10184 ,5, 18961382171 );
insert into bonus_point(user_id,user_type,phone) values(10185 , 5,18561635365 );
insert into bonus_point(user_id,user_type,phone) values(10186 ,5, 13001685773 );
insert into bonus_point(user_id,user_type,phone) values(10187 , 5,18554826065 );
insert into bonus_point(user_id,user_type,phone) values(10188 , 5,18953993222 );
insert into bonus_point(user_id,user_type,phone) values(10192 , 5,15589824907 );
insert into bonus_point(user_id,user_type,phone) values(10195 ,5, 15650180253 );
insert into bonus_point(user_id,user_type,phone) values(10196 , 5,18653251536 );
insert into bonus_point(user_id,user_type,phone) values(10197 , 5,15964215708 );
insert into bonus_point(user_id,user_type,phone) values(10198 , 5,13379194046 );
insert into bonus_point(user_id,user_type,phone) values(10199 , 5,13070838008 );
insert into bonus_point(user_id,user_type,phone) values(10200 , 5,15563960123 );
insert into bonus_point(user_id,user_type,phone) values(10201 , 5,18669793562 );
insert into bonus_point(user_id,user_type,phone) values(10202 , 5,15263275702 );
insert into bonus_point(user_id,user_type,phone) values(10203 ,5, 15244284102 );
insert into bonus_point(user_id,user_type,phone) values(10204 ,5, 15054818971 );
insert into bonus_point(user_id,user_type,phone) values(10205 , 5,13963981680 );
insert into bonus_point(user_id,user_type,phone) values(10206 , 5,13606396270 );
insert into bonus_point(user_id,user_type,phone) values(10207 ,5, 15192777018);
insert into bonus_point(user_id,user_type,phone) values(10208 , 5,18661668382 );
insert into bonus_point(user_id,user_type,phone) values(10209 , 5,15564275333 );
insert into bonus_point(user_id,user_type,phone) values(10211 , 5,18765953787 );
insert into bonus_point(user_id,user_type,phone) values(10212 , 5,15762974218 );
insert into bonus_point(user_id,user_type,phone) values(10216 , 5,18961382811 );