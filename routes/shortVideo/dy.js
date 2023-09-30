const axios = require('axios')

// 获取重定向后的 url 后缀 id
function getId(url) {
    return axios({
        method: 'get', url: url, maxRedirects: 0, validateStatus: (status) => status === 302
    })
        .then(res => res.headers.location.match(/(?<=(video|note)\/)\d*/g)[0])
        .catch(err => console.log(err))
}

function getXG(id) {
    // 生成 X-Bogus
    return axios({
        method: 'post', url: 'https://tiktok.iculture.cc/X-Bogus', data: {
            url: `https://www.douyin.com/aweme/v1/web/aweme/detail/?aweme_id=${id}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333`,
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.43',
        },
    })
        .then(res => res.data.param)
        .catch(err => console.log(err));
}

function getTTWid() {
    // 生成 TTWid
    return axios({
        method: 'post', url: 'https://ttwid.bytedance.com/ttwid/union/register/', data: JSON.stringify({
            region: 'cn',
            aid: 1768,
            needFid: false,
            service: 'www.ixigua.com',
            migrate_info: { ticket: '', source: 'node' },
            cbUrlProtocol: 'https',
            union: true,
        }),
    })
        .then(res => res.headers['set-cookie'][0].match(/(?<=ttwid=)\S*(?=;)/g)[0])
        .catch(err => console.log(err));
}

// 请求
function getDataInfo(url, msToken, ttWid) {
    return axios({
        method: 'get', url: url, headers: {
            Referer: 'https://www.douyin.com/',
            Cookie: `msToken=${msToken}; ttwid=${ttWid}; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWNsaWVudC1jc3IiOiItLS0tLUJFR0lOIENFUlRJRklDQVRFIFJFUVVFU1QtLS0tLVxyXG5NSUlCRFRDQnRRSUJBREFuTVFzd0NRWURWUVFHRXdKRFRqRVlNQllHQTFVRUF3d1BZbVJmZEdsamEyVjBYMmQxXHJcbllYSmtNRmt3RXdZSEtvWkl6ajBDQVFZSUtvWkl6ajBEQVFjRFFnQUVKUDZzbjNLRlFBNUROSEcyK2F4bXAwNG5cclxud1hBSTZDU1IyZW1sVUE5QTZ4aGQzbVlPUlI4NVRLZ2tXd1FJSmp3Nyszdnc0Z2NNRG5iOTRoS3MvSjFJc3FBc1xyXG5NQ29HQ1NxR1NJYjNEUUVKRGpFZE1Cc3dHUVlEVlIwUkJCSXdFSUlPZDNkM0xtUnZkWGxwYmk1amIyMHdDZ1lJXHJcbktvWkl6ajBFQXdJRFJ3QXdSQUlnVmJkWTI0c0RYS0c0S2h3WlBmOHpxVDRBU0ROamNUb2FFRi9MQnd2QS8xSUNcclxuSURiVmZCUk1PQVB5cWJkcytld1QwSDZqdDg1czZZTVNVZEo5Z2dmOWlmeTBcclxuLS0tLS1FTkQgQ0VSVElGSUNBVEUgUkVRVUVTVC0tLS0tXHJcbiJ9`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.43',
        },
    }).then((res) => {
        if (res.data.aweme_detail.video && !res.data.aweme_detail.images) {
            return {
                code: 0, message: '抖音视频解析成功', data: {
                    title: res.data.aweme_detail.desc,
                    author: res.data.aweme_detail.author.nickname,
                    avatar: res.data.aweme_detail.author.avatar_thumb.url_list[0],
                    cover: res.data.aweme_detail.video.origin_cover.url_list[0],
                    music: res.data.aweme_detail.music.play_url.url_list[0],
                    video: res.data.aweme_detail.video.play_addr.url_list[0]
                },
            };
        } else if (res.data.aweme_detail.images) {
            let images = []
            for (let i = 0; i < res.data.aweme_detail.images.length; i++) {
                images.push(res.data.aweme_detail.images[i].url_list[0])
            }
            return {
                code: 0, message: '抖音图集解析成功', data: {
                    title: res.data.aweme_detail.desc,
                    author: res.data.aweme_detail.author.nickname,
                    avatar: res.data.aweme_detail.author.avatar_thumb.url_list[0],
                    music: res.data.aweme_detail.music.play_url.url_list[0],
                    images: images
                },
            };
        } else {
            return {
                code: 1, message: '未检测到链接中含有视频或图集'
            }
        }
    }).catch((err) => {
        console.log(err);
        return {
            code: 1, message: '抖音解析失败'
        };
    });
}

// 获取随机 msToken
function getRandomStr() {
    const baseStr = 'ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz0123456789=';
    let randomStr = '';
    for (let i = 0; i < 107; i++) {
        randomStr += baseStr[Math.floor(Math.random() * baseStr.length)];
    }
    return baseStr;
}

module.exports = {
    getId, getXG, getTTWid, getDataInfo, getRandomStr
}