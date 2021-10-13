const amqp = require('amqplib') 
var axios = require('axios');
const INTERVAL_DURATION = 60000;
// const INTERVAL_DURATION = 60000;
// const url = "amqp://localhost";
const url = 'amqps://bdqryjuc:FctmJfyXZXG1syIAx8EKZaRzEBmVv5h-@clam.rmq.cloudamqp.com/bdqryjuc';
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
          ch.sendToQueue('yiawa', Buffer.from(JSON.stringify(data)))
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
  }

}