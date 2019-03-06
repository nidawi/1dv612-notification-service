const express = require('express')
const controller = require('../controller/MailController')
const router = express.Router()

router.route('/:service')
  .post(async (req, res, next) => {
    try {
      await controller.sendMessage(req.params.service, req.body)
      res.send()
    } catch (err) { next(err) }
  })

module.exports = router
