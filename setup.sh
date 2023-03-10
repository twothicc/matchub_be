#!/bin/bash

export DEBIAN_FRONTEND="noninteractive"
sudo debconf-set-selections <<< "mysql-server mysql-server/root_password password root"
sudo debconf-set-selections <<< "mysql-server mysql-server/root_password_again password root"
sudo apt update
sudo apt install -y mysql-server
sudo /etc/init.d/mysql start
mysql -h 127.0.0.1 -P 3306 -uroot -proot -e "DELETE FROM mysql.user WHERE User=''; DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1'); DROP DATABASE IF EXISTS test; FLUSH PRIVILEGES;"
mysql -h 127.0.0.1 -P 3306 -uroot -proot -e "CREATE USER 'test'@'127.0.0.1' IDENTIFIED BY 'test1234.'"
mysql -h 127.0.0.1 -P 3306 -uroot -proot -e "CREATE SCHEMA matchub DEFAULT CHARACTER SET utf8mb4"
mysql -h 127.0.0.1 -P 3306 -uroot -proot -e "GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, INDEX ON matchub.* TO 'test'@'127.0.0.1'"