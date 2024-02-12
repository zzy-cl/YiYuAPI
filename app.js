const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const shortVideo = require('./routes/shortVideo/index')
const download = require('./routes/download/index')

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.get('/', (req, res) => {
  res.send('欢迎使用呓语API！')
})
app.use('/v1', shortVideo)
app.use('/v1', download)
app.listen(port, () => {
  console.log(`项目已启动，监听端口为：${port}`)
})