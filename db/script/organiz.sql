DROP TABLE IF EXISTS `organiz`;
CREATE TABLE `organiz` (
  `id` BIGINT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `part_id` BIGINT(11) NOT NULL,
  `part_name` VARCHAR(100) NOT NULL,
  `level` BIGINT(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4;


INSERT INTO organiz (part_id,part_name,LEVEL) VALUES (1,'物流事业部',1);
INSERT INTO organiz (part_id,part_name,LEVEL) VALUES (2,'齐鲁事业部',1);
INSERT INTO organiz (part_id,part_name,LEVEL) VALUES (3,'大商事业部',1);
INSERT INTO organiz (part_id,part_name,LEVEL) VALUES (4,'胶东事业部',1);
INSERT INTO organiz (part_id,part_name,LEVEL) VALUES (5,'集海事业部',1);
INSERT INTO organiz (part_id,part_name,LEVEL) VALUES (6,'场站事业部',1);
INSERT INTO organiz (part_id,part_name,LEVEL) VALUES (7,'船代事业部',1);
INSERT INTO organiz (part_id,part_name,LEVEL) VALUES (8,'鲁南事业部',1);
