## Setup Instructions

Install node version v16.13.2 and npm version 8.1.2
You can do so using nvm:

1. `sudo apt update`
2. `sudo apt install curl`
3. `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`
4. `nvm -v` to check that nvm is installed. If you get `nvm: command not found`, then run `source ~/.bashrc` or simply close the current terminal and open a new one.
5. `nvm install v16.13.2`. This should install both nodejs and npm.
6. run `nvm ls` to check that node version `v16.13.2` is installed and that you are using it. If not using `v16.13.2`, then run `nvm use v16.13.2`.
7. run `npm -v`. If not the correct version, you can run `npm install npm@8.1.2 -g` to install it.

Setup the project.

1. Run `git clone https://github.com/twothicc/matchub_be.git`
2. `cd matchub_be`
3. Run `chmod u+x setup.sh`, then run `./setup.sh`. This will install a MySQL server and setup a user with the necessary permissions for this demo.
4. In this directory, run `npm install`
5. Run `npm start`

**Note**: It is highly recommended to uninstall the MySQL server afterwards since this is very insecure.

**Note**: If the setup script does not work, please install MySQL manually. Create a schema named `matchub` and a user named `test`. Set the password for the user to be `test1234.`.

If using MySQL workbench: Create Schema `matchub`. Under Administration > Users and Privileges, grant the user `test` these specific schema permissions `ALTER CREATE DELETE INDEX INSERT REFERENCES SELECT UPDATE` for the schema `matchub`

If using MySQL shell, input these commands in the MySQL shell:

1. `CREATE SCHEMA IF NOT EXISTS matchub DEFAULT CHARACTER SET utfmb4` to create the schema `matchub`
2. `CREATE USER 'test'@'127.0.0.1' IDENTIFIED BY 'test1234.'` to create the `test` user
3. `GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, INDEX ON matchub.* TO 'test'@'127.0.0.1'` to grant `matchub` schema privileges to `test` user
