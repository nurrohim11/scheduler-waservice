const amqp = require('amqplib') 
var axios = require('axios');
const INTERVAL_DURATION = 60000;
const fs = require("fs");
const { compare2JsonArray } = require('../helpers/Deepcompare');
const url = "amqp://localhost";
// const url = 'amqps://bdqryjuc:FctmJfyXZXG1syIAx8EKZaRzEBmVv5h-@clam.rmq.cloudamqp.com/bdqryjuc';
// const url = 'amqps://bdqryjuc:FctmJfyXZXG1syIAx8EKZaRzEBmVv5h-@clam.rmq.cloudamqp.com/bdqryjuc' || "amqp://localhost";

module.exports = {

  wa:async(req, res)=>{
    try{
      const { sender, number, message } = req.body
      amqp.connect(url)
      .then(conn => {
        return conn.createChannel().then(ch => {
          const data = {
            sender:sender,
            number:number,
            message:message,
          }
          ch.sendToQueue('schedulerwa', Buffer.from(JSON.stringify(data)))
          res.status(200).json({message:"Successfully send message"});
        })
        .finally(() => {
          setTimeout(function() { conn.close(); }, INTERVAL_DURATION);
        })
      })
    } catch(err){
      console.log(err)
      res.print_json(400, "Terjadi kesalahan data",[])
    }
  },

  senderId:async(req, res)=>{
    try{
      const jsondata =[
        {
          id:1,
          sender:'yiawa',
        },
        {
          id:2,
          sender:'farqa',
        },
        {
          id:3,
          sender:'kenza',
        },
        {
          id:4,
          sender:'rohim.dev',
        },
        {
          id:5,
          sender:'gogon',
        },
        {
          id:6,
          sender:'gmedia',
        },
      ]
      const path = './json/sender.json'

      try {

        if (fs.existsSync(path)) {
          fs.readFile(path, "utf8", async(err, jsonString) => {
            if (err) {
              console.log("File read failed:", err);
              return;
            }
            let result = await compare2JsonArray(JSON.stringify(jsondata), jsonString)
            if(!result){
              var senderParsing = JSON.parse(jsonString)
              const datanotsame = jsondata.filter(f =>
                !senderParsing.some(d => d.sender == f.sender)
              ); 
              for(let j=0; j < datanotsame.length; j++){
                senderParsing.push(datanotsame[j])
              }
              fs.writeFile(path, JSON.stringify(senderParsing), (err) => {
                  if (err) throw err;
                  console.log('Data written to file');
              });
            }
          });
        }
        else{
          const jsonString = JSON.stringify(jsondata)
          fs.writeFile(path, jsonString, err => {
            if (err) {
              console.log('Error writing file', err)
            } else {
              console.log('Successfully wrote file')
            }
          })
          console.log('not exist')
        }
        res.print_json(200, "Succesfully",[])
      } catch(err){
        console.log(err)
        res.print_json(400, "Failed",[])
      }
    } catch(err){
      console.log(err)
    }
  }

}