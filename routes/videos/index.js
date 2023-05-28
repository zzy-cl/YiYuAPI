const express = require('express')
const router = express.Router()
const dy = require('./dy')
const ks = require('./ks')


router.get('/videos', async (req, res) => {
    // 去文案，提取 url
    let url = req.query.url.match(/https:\/\/\S*/g)[0]

    // 获取视频类型
    const types = ['douyin', 'kuaishou']
    let videoType = types[0]
    for (let i = 0; i < types.length; i++) {
        if (url.indexOf(types[i]) !== -1) {
            videoType = types[i];
            break;
        }
    }

    let dataInfo = {}

    if (videoType === 'douyin') {
        const id = await dy.getId(url)
        const XB = await dy.getXG(id)
        const msToken = dy.getRandomStr()
        const ttWid = await dy.getTTWid()
        dataInfo = await dy.getDataInfo(XB, msToken, ttWid)
    } else if (videoType === 'kuaishou') {
        const redirectUrl = await ks.getRedirectUrl(url)
        dataInfo = await ks.getDataInfo(redirectUrl)
    }
    res.send(dataInfo)
})

module.exports = router