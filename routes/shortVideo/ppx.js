const axios = require('axios')

// 获取重定向后的 url 后缀 id
function getId(url) {
    return axios({
        method: 'get', url: url, maxRedirects: 0, validateStatus: (status) => status === 302
    })
        .then(res => {
            console.log(res.headers.location.match(/(?<=item\/)\d*/g)[0])
            return res.headers.location.match(/(?<=item\/)\d*/g)[0]
        })
        .catch(err => console.log(err))
}

// 获取数据
function getDataInfo(id) {
    return axios({
        method: 'get', url: `https://is.snssdk.com/bds/cell/detail/?cell_type=1&aid=1319&app_name=super&cell_id=${id}`
    }).then(res => {
        if (res.data.data.data.item.video) {
            return {
                code: 0, message: '皮皮虾视频解析成功', data: {
                    title: res.data.data.data.item.content || '无',
                    author: res.data.data.data.item.author.name,
                    avatar: res.data.data.data.item.author.avatar.url_list[0].url,
                    cover: res.data.data.data.item.cover.url_list[0].url,
                    music: '无',
                    video: [res.data.data.data.item.origin_video_download.url_list[0].url]
                }
            }
        } else if (res.data.data.data.item.note) {
            let images = []
            for (let i = 0; i < res.data.data.data.item.note.multi_image.length; i++) {
                images.push(res.data.data.data.item.note.multi_image[i].url_list[0].url)
            }
            return {
                code: 0, message: '皮皮虾图集解析成功', data: {
                    title: res.data.data.data.item.content || '无',
                    author: res.data.data.data.item.author.name,
                    avatar: res.data.data.data.item.author.avatar.url_list[0].url,
                    cover: res.data.data.data.item.cover.url_list[0].url,
                    music: '无',
                    images: images
                }
            }
        } else {
            return {
                code: 1, message: '未检测到链接中含有视频或图集'
            }
        }
    }).catch(err => {
        console.log(err)
        return {
            code: 1, message: '皮皮虾解析失败'
        }
    })
}

module.exports = {
    getId, getDataInfo
}