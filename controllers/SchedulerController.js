const amqp = require('amqplib') 
var axios = require('axios');

module.exports = {

  wa:async(req, res)=>{
    try{
      const { senderid, number, pesan } = req.body
      amqp.connect('amqp://localhost')
      .then(conn => {
        return conn.createChannel().then(ch => {
          const data = {
            senderid:senderid,
            number:number,
            pesan:pesan,
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