// consumer.js
const AWS = require('aws-sdk');
const { promisify } = require('util');
// again, specify default Localstack region
AWS.config.update({ region: 'us-east-1' });
// also, the same as with the publisher
const sqs = new AWS.SQS({ endpoint: 'http://localhost:4566' });
// as i said, i like promises
sqs.receiveMessage = promisify(sqs.receiveMessage);
sqs.deleteMessage = promisify(sqs.deleteMessage);
const QueueUrl = 'http://localhost:4566/000000000000/contracts-queue'; // leave this one blank for now!
const receiveParams = {
  QueueUrl,
  MaxNumberOfMessages: 1
};
async function receive() {
  try {
    const queueData = await sqs.receiveMessage(receiveParams);
    if (
      queueData &&
      queueData.Messages &&
      queueData.Messages.length > 0
    ) {
        console.log(queueData.Messages)
      const [firstMessage] = queueData.Messages;
      console.log('RECEIVED: ', firstMessage);
      const deleteParams = {
        QueueUrl,
        ReceiptHandle: firstMessage.ReceiptHandle
      };
      console.log(deleteParams);
      const result = await sqs.deleteMessage(deleteParams);
      console.log('DELETE RESULT', result);
    } else {
      // console.log('waiting...');
    }
  } catch (e) {
    console.log('ERROR: ', e);
  }
}
// we poll every 500ms and act accordingly
setInterval(receive, 500);
