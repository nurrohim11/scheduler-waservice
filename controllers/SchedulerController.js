const amqp = require('amqplib') 

module.exports = {

  wa:async(req, res)=>{
    try{
      const { sender, number, message } = req.body

      const url = process.env.MODE == 'development' ? process.env.URI_MQTT_DEVELOPMENT : process.env.URI_MQTT_PRODUCTION

      amqp.connect(url)
      .then(conn => {
        return conn.createChannel().then(async(ch) => {
          const data = {
            sender:sender,
            number:number,
            message:message,
          }

          await ch.assertExchange(sender, process.env.EXCHANGE_TYPE);
          // await ch.assertQueue(sender);
          await ch.bindQueue(sender, sender, 'gmedia');
          // ch.bindQueue(QUEUE_NAME, EXCHANGE_NAME, KEY);
          await ch.sendToQueue(sender, Buffer.from(JSON.stringify(data)))
          res.status(200).json({message:"Successfully send message"});
        })
        .finally(() => {
          setTimeout(function() { conn.close(); }, process.env.INTERVAL_DURATION);
        })
      })
    } catch(err){
      console.log(err)
      res.print_json(400, "Terjadi kesalahan data",[])
    }
  },

  wa_service:async(req, res)=>{
    try{
      const { sender, number, message } = req.body
      
      const url = process.env.MODE == 'development' ? process.env.URI_MQTT_DEVELOPMENT : process.env.URI_MQTT_PRODUCTION

      amqp.connect(url)
      .then(conn => {
        return conn.createChannel().then(ch => {
          const data = {
            sender:sender,
            number:number,
            message:message,
          }
          ch.sendToQueue(process.env.CHANNEL, Buffer.from(JSON.stringify(data)))
          res.status(200).json({message:"Successfully send message by channel "+process.env.CHANNEL});
        })
        .finally(() => {
          setTimeout(function() { conn.close(); }, process.env.INTERVAL_DURATION);
        })
      })
    } catch(err){
      console.log(err)
      res.print_json(400, "Terjadi kesalahan data",[])
    }
  },

  yiawa:async(req, res)=>{
    try{
      const { sender, number, message } = req.body
      
      const url = process.env.MODE == 'development' ? process.env.URI_MQTT_DEVELOPMENT : process.env.URI_MQTT_PRODUCTION

      amqp.connect(url)
      .then(conn => {
        return conn.createChannel().then(ch => {
          const data = {
            sender:sender,
            number:number,
            message:message,
          }
          ch.sendToQueue('testing2', Buffer.from(JSON.stringify(data)))
          res.status(200).json({message:"Successfully send message"});
        })
        .finally(() => {
          setTimeout(function() { conn.close(); }, process.env.INTERVAL_DURATION);
        })
      })
    } catch(err){
      console.log(err)
      res.print_json(400, "Terjadi kesalahan data",[])
    }
  },

  senderId:async(req, res)=>{
    try{
    } catch(err){
      console.log(err)
    }
  }

}