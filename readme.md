# Kue Sample Implementation

## Ninja Camp

Sample Implementation of kue mq in a simple node app.


## Dependencies
  - Node
  - Express
  - Redis
  - Kue
  - Sleep

  ## Project Initialization
  - Install Packages(package.json)

        $ npm install 

  - Install Redis

        $ brew tap redis-stack/redis-stack
        $ npm install --global redis
        $ brew install --cask redis-stack

  - Start Redis Server
        $ redis-server

    Note: (Take note of the port)

## Run Kue and Express server
    $ Nodemon start server


## Run Worker
    $ node worker.js

## Kue Dashboard
    $ 127.0.0.1:4000

## Create Jobs
    $ 127.0.0.1:3000/job1
    $ 127.0.0.1:3000/job2

