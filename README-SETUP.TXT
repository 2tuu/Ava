Before running the setup program enter all the required information into config.json

For the installation process the only thing that is needed is the MySQL login, password and database name, the database will be created by the program

To start the bot, go into the setup folder and run setup.sh, or setup.bat after installing NodeJS and setting up MySQL on your own
For Linux, setup.sh will need to be given execution permissions before being run ('chmod +x setup.sh' from inside the setup directory)
Setup.bat will not need any modification

It is recommended you run this with a daemon, PM2 works well
Install it with 'npm i -g pm2' or 'sudo npm i -g pm2' if you're using Linux and the first doesn't work

Then run the bot with 'pm2 start app.js' in the base folder