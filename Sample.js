const kue = require('kue');

//config kue
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

kue.app.listen(4000);
  // Clean Up Completed Job
  queue
    .on('job enqueue', function (id, type) {
      console.log('Job %s got queued of type %s', id, type);
    })
    .on('job complete', function (id, result) {
      console.log('ID: ', id, ' Result: ', result);
      kue.Job.get(id, function (err, job) {
        if (err) {
          return false;
        } else {
          job.remove(function (err) {
            if (err) {
              throw err;
            } else {
              console.log('removed completed job #%d', job.id);
            }
          });
        }
      });
    });

  // Graceful Shutdown
  process.once('SIGTERM', function (sig) {
    queue.shutdown(5000, function (err) {
      console.log('Queue shutting down: ', err || '');
      process.exit(0);
    });
  });

  // Error Handling
  queue.on('error', function (err) {
    console.log('Queue Error... ', err);
  });


  // Pull Jobs out of stuck state
  queue.watchStuckJobs(2000);



//create a j0b queue


let job = queue.create(
    'sample Job',
     {message:'hi, I am just a sample'}
).save(function(err){
    if( !err ) console.log( job.id );
 });


 let job2 = queue.create(
    'sample Delayed Job ',
     {message:'hi, I am supposed to delay'}
).delay(4000).priority('high').save(function(err){
    if( !err ) console.log( job2.id);
 });



 //process Jobs


 
