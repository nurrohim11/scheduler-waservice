const amqp = require('amqplib')
const axios = require('axios');
const fs = require('fs')
const url = "amqp://localhost";
// const url = 'amqps://bdqryjuc:FctmJfyXZXG1syIAx8EKZaRzEBmVv5h-@clam.rmq.cloudamqp.com/bdqryjuc' || "amqp://localhost";
// const url = 'amqps://bdqryjuc:FctmJfyXZXG1syIAx8EKZaRzEBmVv5h-@clam.rmq.cloudamqp.com/bdqryjuc';

// example sender
// const sender = []

amqp.connect(url)
  .then(conn=> {
    return conn.createChannel().then(async(ch) => {
      const path = await './json/sender.json'
      if (fs.existsSync(path)) {
        fs.readFile(path, "utf8", async(err, jsonString) => {
          if (err) {
            console.log("File read failed:", err);
            return;
          }
          const sender = JSON.parse(jsonString)
          for(let j=0; j< sender.length; j++){
            const queue1 = ch.assertQueue(sender[j].sender, {durable:false})
            queue1.then(()=>{
              return ch.consume(sender[j].sender, async(msg)=>{
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
      }

      const queue2 = ch.assertQueue("schedulerwa", {durable:false})
      queue2.then(()=>{
        return ch.consume("schedulerwa", async(msg)=>{
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
    })
}).catch(console.warn)