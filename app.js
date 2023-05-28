const express = require('express')
const app = express()
const port = 3000
const videos = require('./routes/videos/index')

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/v1', videos)
app.listen(port, () => {
    console.log(`项目已启动，监听端口为：${port}`)
})