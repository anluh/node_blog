# Blog | Node.js + Mongodb
Personal blog with authorisation

## Get Started 
* This project use [mongodb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/) database. Needs to be installed globally.
The name of database is `node_learn`. You can change it in [database.js](config/database.js) and [www](bin/www) files.
* Run in the root directory
```
$ npm install
```
* Install [nodemon](https://www.npmjs.com/package/nodemon) for starting server. 
```
$ npm install -g nodemon
```
* Install bootstrap and jQuery
```
$ bower install bootstrap jquery
```

## Usage

To start server write in root directory
```
$ nodemon bin/www
```

## Deploy
Project connected to [mLab db](https://www.mlab.com/databases/heroku_z9bqn6g0). And deployed on [Hiraku](https://dashboard.heroku.com/apps/anluh-node-blog).

[Link to the live site](https://gentle-chamber-68420.herokuapp.com/)

To deploy after pushing to GIT run on bash:
```
$ git heroku push master

$ heroku open
```
