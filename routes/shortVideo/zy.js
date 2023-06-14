const axios = require('axios')

function getDataInfo(url) {
    const pid = url.match(/(?<=pid=)\d*/g)[0]
    return axios({
        method: 'post', url: 'https://share.xiaochuankeji.cn/planck/share/post/detail', data: JSON.stringify({
            pid: Number(pid), h_av: '5.2.13.011'
        })
    }).then(res => {
        if (res.data.data.post.videos) {
            let videos = []
            let keyList = Object.keys(res.data.data.post.videos)
            for (let i = 0; i < keyList.length; i++) {
                let url = res.data.data.post.videos[keyList[i]].url
                videos.push(url)
            }
            return {
                code: 0, message: '最右视频解析成功', data: {
                    title: res.data.data.post.content,
                    author: res.data.data.post.member.name,
                    avatar: res.data.data.post.member.avatar_urls.origin.urls[0],
                    cover: '无',
                    music: '无',
                    videos: videos
                }
            }
        } else if (res.data.data.post.imgs) {
            let images = []
            for (let i = 0; i < res.data.data.post.imgs.length; i++) {
                images.push(res.data.data.post.imgs[i].urls.origin.urls[0])
            }
            return {
                code: 0, message: '最右图集解析成功', data: {
                    title: res.data.data.post.content,
                    author: res.data.data.post.member.name,
                    avatar: res.data.data.post.member.avatar_urls.origin.urls[0],
                    music: '无',
                    images: images
                },
            };
        } else {
            return {
                code: 1, message: '未检测到链接中含有视频或图集'
            }
        }

    }).catch(err => {
        console.log(err)
        return {
            code: 1, message: '最右解析失败'
        }
    })
}

module.exports = {
    getDataInfo
}