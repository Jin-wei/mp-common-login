DROP TABLE IF EXISTS `region`;
CREATE TABLE `region` (
`id`  int(11) NOT NULL ,
`name`  varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
`pid`  int(11) NULL DEFAULT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci