const amqp = require('amqplib')
const axios = require('axios');
const url = "amqp://localhost";
// const url = 'amqps://bdqryjuc:FctmJfyXZXG1syIAx8EKZaRzEBmVv5h-@clam.rmq.cloudamqp.com/bdqryjuc' || "amqp://localhost";
// const url = 'amqps://bdqryjuc:FctmJfyXZXG1syIAx8EKZaRzEBmVv5h-@clam.rmq.cloudamqp.com/bdqryjuc';

// example sender
const sender = ['schedulerwa','gogon','yiawa','test1']

amqp.connect(url)
  .then(conn=> {
    return conn.createChannel().then(ch => {
      for (let i=0; i < sender.length; i++){
        const queue1 = ch.assertQueue(sender[i], {durable:false})
        queue1.then(()=>{
          return ch.consume(sender[i], async(msg)=>{
            let dataqueue = JSON.parse(msg.content.toString())
            console.log('dataqueue queue ',dataqueue)

            var data = JSON.stringify({
              "sender": dataqueue.sender,
              "message": dataqueue.message,
              "number": dataqueue.number
            });

            var config = {
              method: 'post',
              url: 'http://116.254.117.132:801/send-message',
              headers: { 
                'Client-Service': 'perkasa-sales', 
                'Auth-Key': 'gmedia', 
                'Nik-Ga': '930034', 
                'Timestamp': '', 
                'Signature': '', 
                'User-Id': '', 
                'Content-Type': 'application/json'
              },
              data : data
            };

            axios(config)
            .then(function (response) {
              console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
              console.log(error);
            });
          })
        }, {noAck:true})
      }
    })
}).catch(console.warn)