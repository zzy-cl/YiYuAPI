const express = require('express')
const router = express.Router()
const dy = require('./dy')
const ks = require('./ks')
const ppx = require('./ppx')
const zy = require('./zy')


router.get('/short-video', async (req, res) => {
    // 去文案，提取 url
    let url = req.query.url.match(/https:\/\/\S*/g)[0]

    // 获取视频类型
    const types = ['douyin', 'kuaishou', 'pipix', 'xiaochuankeji']
    let videoType = ''
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
        dataInfo = await ks.getDataInfo(redirectUrl.location, redirectUrl.did, redirectUrl.didv)
    } else if (videoType === 'pipix') {
        const id = await ppx.getId(url)
        dataInfo = await ppx.getDataInfo(id)
    } else if (videoType === 'xiaochuankeji') {
        // 最右
        dataInfo = await zy.getDataInfo(url)
    } else {
        dataInfo = {
            code: 1,
            message: '请输入正确且合法的链接'
        }
    }
    res.send(dataInfo)
})

module.exports = router