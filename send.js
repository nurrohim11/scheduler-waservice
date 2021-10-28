var axios = require('axios');
var data = JSON.stringify({
  "sender": "gmediawablez",
  "message": "testing",
  "number": "089668714552"
});

var config = {
  method: 'post',
  url: 'http://portainer.gmedia.bz:3000/schedulerwa',
  headers: { 
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
