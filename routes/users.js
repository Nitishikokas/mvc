const { exec } = require('child_process');
var express = require('express');
const path = require('path');
var router = express.Router();
const fs=require('fs');
/* GET users listing. */
const fsext=require('fs-extra');
const archiver = require('archiver');
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/execute-command', (req, res) => {
  const {appname,technology,database,schema}=req.body;
  console.log(appname,technology,database,schema);
  const command = `
  npx express-generator ${appname} &&
  cd ${appname} &&
  npm install &&
  npm install express-handlebars sequelize sequelize-cli mysql2 dotenv bcrypt &&
  npx sequelize-cli init &&
  npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string &&
  npx sequelize-cli
`.replace(/\n/g, ' ');
console.log("REEEEEEEEEEE",command);
  exec(command, (error, stdout, stderr) => {
    console.log("REWERWEW"); 
    if (error) {
      console.error('Error:', error);
      res.status(500).json('Project setup failed.');
      return;
    }
    res.status(200).json('Project setup completed successfully.');
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);
  });
  res.status(200).json({message:'Project setup completed successfully.',status:200});
});
router.post('/setup-project', (req, res) => {
  const {appname,technology,database,schema}=req.body;
  console.log(appname,technology,database,schema);
  const pathroot=`../../user-management-system/${appname}`
  const rootPath = path.join(__dirname, pathroot);
  console.log("gjhgjh",rootPath);
  const controllersPath = path.join(rootPath, 'controllers');
  const connectionPath = path.join(rootPath, 'connection');
  const modelsPath = path.join(rootPath, 'models');
  const sourceFolderPathEmail = path.join(__dirname, '..', 'views', 'email');
const destinationFolderPathEmail = path.join(__dirname, '..', `${appname}`, 'views/email');
const sourceFolderPathSMS = path.join(__dirname, '..', 'views', 'sms');
const destinationFolderPathSMS = path.join(__dirname, '..', `${appname}`, 'views/sms');
const sourceFolderPathServices = path.join(__dirname, '..', 'services');
const destinationFolderPathServices = path.join(__dirname, '..', `${appname}/services`);
const sourceFolderPathModel = path.join(__dirname, '../models', 'UserModel');
const destinationFolderPathModel = path.join(__dirname, '..', `${appname}/model`);

const sourceFolderPathConfig= path.join(__dirname, '..', 'config');
const destinationFolderPathConfig = path.join(__dirname, '..', `${appname}/config`);
const sourceFolderPathMiddleware= path.join(__dirname, '..', 'middleware');
const destinationFolderPathMiddleware = path.join(__dirname, '..', `${appname}/middleware`);
const sourceFolderPathUserRoute= path.join(__dirname, '../routes', 'v1');
const destinationFolderPathUserRoute = path.join(__dirname, '..', `${appname}/routes/v1`);
const sourceFolderPathUtils= path.join(__dirname, '..', 'utils');
const destinationFolderPathUtils = path.join(__dirname, '..', `${appname}/utils`);
const sourceFolderPathControlers= path.join(__dirname, '..', 'controller');
const destinationFolderPathControlers = path.join(__dirname, '..', `${appname}/controller`);
const sourceFolderPathEnv= path.join(__dirname, '..', '.env');
const destinationFolderPathEnv = path.join(__dirname, '..', `${appname}/.env`);
const sourceFolderPathApp= path.join(__dirname, '../extra', 'app.js');
const destinationFolderPathApp = path.join(__dirname, '..', `${appname}/app.js`);
const sourceFolderPathpkg= path.join(__dirname, '../extra', 'package.json');
const destinationFolderPathpkg = path.join(__dirname, '..', `${appname}/package.json`);
   try {
     fs.cpSync(sourceFolderPathEmail,destinationFolderPathEmail, {recursive: true})
     fs.cpSync(sourceFolderPathSMS,destinationFolderPathSMS, {recursive: true})
     fs.cpSync(sourceFolderPathServices,destinationFolderPathServices, {recursive: true})
     fs.cpSync(sourceFolderPathModel,destinationFolderPathModel, {recursive: true})
     fs.cpSync(sourceFolderPathConfig,destinationFolderPathConfig, {recursive: true})
     fs.cpSync(sourceFolderPathMiddleware,destinationFolderPathMiddleware, {recursive: true})
     fs.cpSync(sourceFolderPathUserRoute,destinationFolderPathUserRoute, {recursive: true})
     fs.cpSync(sourceFolderPathUtils,destinationFolderPathUtils, {recursive: true})
     fs.cpSync(sourceFolderPathControlers,destinationFolderPathControlers, {recursive: true})
     fs.cpSync(sourceFolderPathEnv,destinationFolderPathEnv, {recursive: true})
     fs.cpSync(sourceFolderPathApp,destinationFolderPathApp, {recursive: true})
     fs.cpSync(sourceFolderPathpkg,destinationFolderPathpkg, {recursive: true})
     // Create controllers folder
    fs.mkdirSync(controllersPath);
    // Create connection folder
    fs.mkdirSync(connectionPath);
    // Create models folder
    fs.mkdirSync(modelsPath);
   
    // Create userController.js file
    fs.writeFileSync(path.join(controllersPath, 'userController.js'), generateUserController());
    // Create db.js file
    fs.writeFileSync(path.join(connectionPath, 'db.js'), generateDatabaseConnection());

    // Create User model
    fs.writeFileSync(path.join(modelsPath, 'User.js'), generateUserModel());

    res.json({ message: 'Project setup commands executed successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
router.post('/remove-project', async (req, res) => {
  const {appname,technology,database,schema}=req.body;
  console.log(appname,technology,database,schema);
  const pathroot=`../../user-management-system/${appname}`;
  const rootPath = path.join(__dirname, pathroot);

  try {
    // Remove the user-management-system directory and its contents
    await fsext.remove(rootPath);

    res.json({ message: 'Project directory removed successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
router.get('/download-folder', (req, res) => {
  const folderPath = path.join(__dirname, '../../user-management-system/user-management-system'); // Adjust the folder path accordingly
  const zipFileName = 'folder.zip';

  // Create a new zip archive
  const archive = archiver('zip', {
    zlib: { level: 9 } // Set compression level to maximum
  });

  // Pipe the archive to the response stream
  archive.pipe(res);

  // Add the folder and its contents to the archive
  archive.directory(folderPath, false);

  // Finalize the archive and send it to the client
  archive.finalize();

  // Set the appropriate headers for the response
  res.attachment(zipFileName);
  res.contentType('application/zip');
});
router.get('/download-folder-mongo', (req, res) => {
  const folderPath = path.join(__dirname, '../../user-management-system/MongoProject'); // Adjust the folder path accordingly
  const zipFileName = 'folder.zip';

  // Create a new zip archive
  const archive = archiver('zip', {
    zlib: { level: 9 } // Set compression level to maximum
  });

  // Pipe the archive to the response stream
  archive.pipe(res);

  // Add the folder and its contents to the archive
  archive.directory(folderPath, false);

  // Finalize the archive and send it to the client
  archive.finalize();

  // Set the appropriate headers for the response
  res.attachment(zipFileName);
  res.contentType('application/zip');
});
function generateUserController() {
  return `
    const { User } = require('../models');

    module.exports = {
      getUsers: async (req, res) => {
        try {
          const users = await User.findAll();
          res.json(users);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server Error' });
        }
      },

      // Define other controller methods here
    };
  `;
}

// Function to generate db.js content
function generateDatabaseConnection() {
  return `
    const { Sequelize } = require('sequelize');
    const dotenv = require('dotenv');
    dotenv.config();

    const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: 'mysql',
    });

    (async () => {
      try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
    })();

    module.exports = sequelize;
  `;
}

// Function to generate User model content
function generateUserModel() {
  return `
    const { DataTypes } = require('sequelize');
    const sequelize = require('../connection/db');

    const User = sequelize.define('User', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    module.exports = User;
  `;
}
module.exports = router;
