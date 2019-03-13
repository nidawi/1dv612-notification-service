const express = require('express')
const mailController = require('../controller/MailController')
const pushController = require('../controller/PushController')
const router = express.Router()

router.route('/push')
  .post(async (req, res, next) => {
    try {
      await pushController.sendPush(req.body.subscription, req.body)
      res.send()
    } catch (err) { next(err) }
  })

router.route('/:service')
  .post(async (req, res, next) => {
    try {
      await mailController.sendMessage(req.params.service, req.body)
      res.send()
    } catch (err) { next(err) }
  })

module.exports = router
