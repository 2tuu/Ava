echo Installing PostgreSQL dependencies...
npm i pg
@echo on
echo Setting up MySQL database...
node setup.js
echo Install complete unless errors were reported
pause