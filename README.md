<h1 align="center">ExpressJS - #backend-Vehicle-Rental RESTfull API</h1>


A vehicle rental website that brings together renters and vehicle owners. It has search, sort, vehicle detail and reservation features for tenants as well as add, update and delete vehicles for owners. Built using NextJS, ExpressJS and MySQL.

<p align='center'>
   ·
<a href="https://rental-next.vercel.app/">Preview Website</a>
   ·
<a href="https://cirlce-conn-rental-vehicle.herokuapp.com/">Rest API</a> 
   ·
<a href="https://github.com/farrelvarian/rental-next">Repository Frontend</a> 
   ·
<a href="https://github.com/farrelvarian/backend-rental">Repository Backend</a> 
   · 


## Built With

[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.12.13-green.svg?style=rounded-square)](https://nodejs.org/)

## Database Schema
<p align='center'>
  <span>
      <image src='./screenshot/db.PNG' />

## Requirements

1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)

## How to run the app ?

1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name #nama_database, and Import file sql to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. localhost:3000/)
8. You can see all the end point [here](https://documenter.getpostman.com/view/9852901/TzJoEfvL)

## Set up .env file

Open .env file on your favorite code editor, and copy paste this code below :

    DB_HOST
    DB_USER
    DB_NAME
    DB_PASS
    DB_PORT
    BASE_URL
    FRONT_URL
    SECRET_KEY
    RENTAL_EMAIL
    RENTAL_PASS
## License

© [Farrel Varian Eka Putra](https://github.com/farrelvarian/)
