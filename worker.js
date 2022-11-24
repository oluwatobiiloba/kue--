const kue = require('kue');
const queue = kue.createQueue(
    {
        prefix: 'q',
        redis: {
          port: 6379,
          host: '127.0.0.1'
         
        }
      }
);
const { sleep } = require('sleep');
console.log('WORKER CONNECTED');
console.log(queue.client.address)

function sampleJob(data,done){
    if(!data){
        return done(new Error('No message recieved'))
    }
    console.log(`Executing sample job 1. Message: ${data}`)
    done(null,'done')
}


queue.process(
    'Delayed Job', 4,function(job,done){
      //Worker delay
        sleep(5);
        // sampleJob(job.data.message,done)
        if(!job.data.message){
            return done(new Error('No message recieved'))
        }
        console.log(`Executing job Message: ${job.data.message}, created on ${job.data.created} 🗡🗡`)
        let message = `I just completed ${job.data.message}, sensie 🥷🥷`

        done(null,message)
        console.log('WORKER JOB COMPLETE');
    }
 );

 queue.process(
    'Simple Job', function(job,done){
        //Worker delay
        //sleep(5);
        // sampleJob(job.data.message,done)
        if(!job.data.message){
            return done(new Error('No message recieved'))
        }
        console.log(`Executing sample job 1. Message: ${job.data.message}, created on ${job.data.Created}`)
        let message = `I just completed ${job.data.message}`

        done(null,message)
        console.log('WORKER JOB COMPLETE');
    }
 );


//  queue.process(
//     'sample Delayed Job', function(job2,done){
//         //sleep(7);
//         sampleJob(job2.data.message,done)
//         console.log('WORKER JOB COMPLETE');
//     }
//  );
