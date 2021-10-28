require('dotenv').config()
const amqp = require('amqplib')
const axios = require('axios');
const fs = require('fs')
const url = process.env.MODE == 'development' ? process.env.URI_MQTT_DEVELOPMENT : process.env.URI_MQTT_PRODUCTION
require('dotenv').config()

// const path = './json/sender.json'
// if (fs.existsSync(path)) {
//   fs.readFile(path, "utf8", async(err, jsonString) => {
//     if (err) {
//       console.log("File read failed:", err);
//       return;
//     }
//     const sender = JSON.parse(jsonString)
//     for(let j=0; j< sender.length; j++){
//       amqp.connect(url)
//         .then(conn=> {
//           return conn.createChannel().then(async(ch) => {
//             const queue2 = ch.assertQueue(sender[j].sender, {durable:false})
//             queue2.then(()=>{
//               return ch.consume(sender[j].sender, async(msg)=>{
//                 let dataqueue = JSON.parse(msg.content.toString())
//                 console.log('dataqueue queue ',dataqueue)

//                 var data = JSON.stringify({
//                   "sender": dataqueue.sender,
//                   "message": dataqueue.message,
//                   "number": dataqueue.number
//                 });

//                 var config = {
//                   method: 'post',
//                   url: 'http://116.254.117.132:801/send-message',
//                   headers: { 
//                     'Client-Service': 'perkasa-sales', 
//                     'Auth-Key': 'gmedia', 
//                     'Nik-Ga': '930034', 
//                     'Timestamp': '', 
//                     'Signature': '', 
//                     'User-Id': '', 
//                     'Content-Type': 'application/json'
//                   },
//                   data : data
//                 };

//                 axios(config)
//                 .then(function (response) {
//                   console.log(JSON.stringify(response.data));
//                 })
//                 .catch(function (error) {
//                   console.log(error);
//                 });
//               })
//             }, {noAck:true})
            
//           })
//       }).catch(console.warn)
//     }
//   })
// }

amqp.connect(url)
  .then(conn=> {
    return conn.createChannel().then(async(ch) => {

      // queue 1
      const path = await './json/sender.json'
      if (fs.existsSync(path)) {
        fs.readFile(path, "utf8", async(err, jsonString) => {
          if (err) {
            console.log("File read failed:", err);
            return;
          }
          const sender = JSON.parse(jsonString)
          for(let j=0; j< sender.length; j++){
            const queueloop = ch.assertQueue(sender[j].sender, {durable:false})
            queueloop.then(()=>{
              return ch.consume(sender[j].sender, async(msg)=>{

                let dataqueue = JSON.parse(msg.content.toString())
                console.log('dataqueue queue ',dataqueue)
                // const webhost ="http://"+process.env.HOST_WASERVICE+":8000/send-message"
                const webhost = 'http://116.254.117.132:801/send-message'

                var data = JSON.stringify({
                  "sender": dataqueue.sender,
                  "message": dataqueue.message,
                  "number": dataqueue.number
                });

                ch.prefetch(1);
                ch.ack(msg)

                var config = {
                  method: 'post',
                  url: webhost,
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

      // // queue 2
      // const queue2 = ch.assertQueue(process.env.CHANNEL, {durable:false})
      // queue2.then(()=>{
      //   return ch.consume(process.env.CHANNEL, async(msg)=>{
      //     let dataqueue = JSON.parse(msg.content.toString())
      //     console.log('dataqueue queue ',dataqueue)
      //     const webhost ="http://"+process.env.HOST_WASERVICE+":8000/send-message"
      //     console.log(webhost)

      //     var data = JSON.stringify({
      //       "sender": dataqueue.sender,
      //       "message": dataqueue.message,
      //       "number": dataqueue.number
      //     });

      //     var config = {
      //       method: 'post',
      //       url: webhost,
      //       // url: 'http://116.254.117.132:801/send-message',
      //       headers: { 
      //         'Client-Service': 'perkasa-sales', 
      //         'Auth-Key': 'gmedia', 
      //         'Nik-Ga': '930034', 
      //         'Timestamp': '', 
      //         'Signature': '', 
      //         'User-Id': '', 
      //         'Content-Type': 'application/json'
      //       },
      //       data : data
      //     };

      //     axios(config)
      //     .then(function (response) {
      //       console.log(JSON.stringify(response.data));
      //     })
      //     .catch(function (error) {
      //       console.log(error);
      //     });
      //   })
      // }, {noAck:true})

      // // queue 3
      // const queue3 = ch.assertQueue("testing", {durable:false})
      // queue3.then(()=>{
      //   return ch.consume("testing", async(msg)=>{
      //     let dataqueue = JSON.parse(msg.content.toString())
      //     console.log('dataqueue queue ',dataqueue)

      //     var data = JSON.stringify({
      //       "sender": dataqueue.sender,
      //       "message": dataqueue.message,
      //       "number": dataqueue.number
      //     });

      //     var config = {
      //       method: 'post',
      //       url: 'http://116.254.117.132:801/send-message',
      //       headers: { 
      //         'Client-Service': 'perkasa-sales', 
      //         'Auth-Key': 'gmedia', 
      //         'Nik-Ga': '930034', 
      //         'Timestamp': '', 
      //         'Signature': '', 
      //         'User-Id': '', 
      //         'Content-Type': 'application/json'
      //       },
      //       data : data
      //     };

      //     axios(config)
      //     .then(function (response) {
      //       console.log(JSON.stringify(response.data));
      //     })
      //     .catch(function (error) {
      //       console.log(error);
      //     });
      //   })
      // }, {noAck:true})
      
    })
}).catch(console.warn)

