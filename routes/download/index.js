const express = require('express')
const router = express.Router()
const video = require('./video')

router.get('/download', async (req, res) => {
  let result = await video.downloadVideo(req.query.url)
  res.send(result)
})

router.post('/download', async (req, res) => {
  let result = await video.downloadVideo(req.body.url)
  res.send(result)
})

module.exports = router