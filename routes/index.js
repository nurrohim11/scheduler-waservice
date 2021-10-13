var express = require('express');
const SchedulerController = require('../controllers/SchedulerController');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to scheduler wa' });
});

router.post('/schedulerwa', SchedulerController.wa)
router.get('/sender', SchedulerController.senderId)

module.exports = router;
