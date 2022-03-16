const AWS = require('aws-sdk');
const { promisify } = require('util');

AWS.config.update({ region: 'us-east-1' });

const sqs = new AWS.SQS({ endpoint: 'http://localhost:4566' });

sqs.sendMessage = promisify(sqs.sendMessage);
const QueueUrl = 'http://localhost:4566/000000000000/contracts-queue';


async function send(msg) {
    const requestParams = {
        QueueUrl,
        MessageBody: msg,
    };
    const data = await sqs.sendMessage(requestParams);
    console.log('PUBLISHED', data);
}

Promise.all([1,2,3,4,5].map((_, i) => send(`message sqs #${i}`))).catch(console.error);
