var cron = require('node-cron');
const url = "amqp://localhost";
const { compare2JsonArray } = require('../helpers/Deepcompare');
const axios = require('axios');
const fs = require('fs')

cron.schedule("*/10 * * * *", function() {
  var config = {
    method: 'get',
    url: 'http://sms-gmedia.gmedia.bz/api/wa-agent',
    headers: { }
  };
  axios(config)
  .then(function (response) {
    const sender = response.data.data
    const jsondata=[]
    for(let n=0; n<sender.length; n++){
      jsondata.push({
        id:sender[n].id,
        sender:sender[n].agent_name,
      })
    }
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
      console.log('successfully')
    } catch(err){
      console.log(err)
      console.log(failed)
    }
  })
  .catch(function (error) {
    console.log(error);
  });
});
