const amqp = require('amqplib') 
var axios = require('axios');
const INTERVAL_DURATION = 60000;
const url = 'amqps://bdqryjuc:FctmJfyXZXG1syIAx8EKZaRzEBmVv5h-@clam.rmq.cloudamqp.com/bdqryjuc' || "amqp://localhost";

module.exports = {

  wa:async(req, res)=>{
    try{
      // console.log('url ',url)
      const { sender, number, message } = req.body
      amqp.connect(url)
      amqp.connect('amqp://localhost')
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
          setTimeout(function() { conn.close(); }, 500);
        })
      })
    } catch(err){
      console.log(err)
      res.print_json(400, "Terjadi kesalahan data",[])
    }
  }

}