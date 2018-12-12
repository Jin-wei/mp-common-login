CREATE SCHEMA `sinotrans_user` ;
CREATE USER 'sino'@'localhost' IDENTIFIED BY 'trans';

GRANT ALL privileges ON sinotrans_user.* TO 'sino'@'localhost'IDENTIFIED BY 'trans';