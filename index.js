const express = require('express');
const kue = require('kue');
const app = express();
const bodyParser = require('body-parser')

//configure kue
var cluster = require('cluster');

let queue = kue.createQueue(
    {
        prefix: 'q',
        redis: {
          port: 6379,
          host: '127.0.0.1' 
         
        }
      }
);

//Kue UI for tracking
kue.app.listen(4000);
  // Log Job completion
  queue
    .on('job enqueue', function (id, type) {
      console.log('Job %s got queued. Title: %s', id, type);
    })
    .on('job complete', function (id, result) {
      console.log('Job ID:', id, ' Message to sensei: ', result);
    });

  // Graceful Shutdown when active job is done
  process.once('SIGTERM', function (sig) {
    queue.shutdown(5000, function (err) {
      console.log('Kue shutting down: ', err || '');
      process.exit(0);
    });
  });

  // Pick errors
  queue.on('error', function (err) {
    console.log('Queue Error: ', err);
  });


  // Pull Jobs out of stuck state
  queue.watchStuckJobs(2000);


  // retry stuck active jobs

  kue.Job.rangeByState( 'active', 0, 1000, 'asc', function( err, jobs ) {
    jobs.forEach(function(job) {
       job.complete();
       queue.create(job.type, job.data).save(); 
    })
});

  //Parse Json Body
  app.use(express.json())

  //Welcome to the worker Dojo
app.get('/', (req, res) => res.send("Welcome to the worker Dojo!, May the best worker win"));



//Create Normal Job
app.get('/job1', (req, res) => {
  const job = queue.create('Simple Job', {message:'Warmup Exercise'
  })
    .priority('high')
    .save((err) => {
      if (err) {
        if( !err ) console.log( job.id );
        res.send('error');
        return;
      }
      // request waits for job to be completed (event listener)
      job.on('complete', (result) => {
        res.send(`Hello  ${result}`);
      });

      // Sends error 
      job.on('failed', () => {
        res.send('error');
      });
    });
});

app.post('/job2', (req, res) => {
    const job = queue.create('Delayed Job', {message: req.body.message, created: new Date().toLocaleString()
    })
    .delay(7000)
    .priority('low')
    .save((err) => {
        if (err) {
          if( !err ) console.log( job.id );
          res.send('error');
          return;
        }

        //list Delayed tasks
        queue.delayed( function( err, ids ) {
                res.send(`Delayed levels to be completed: ${ids}`);
        });
    
  
})});

  //setup server
app.listen(3000, () => console.log('Kue sample server camp is running on port 3000'));