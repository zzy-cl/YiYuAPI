const axios = require('axios')

// 获取重定向后的链接
function getRedirectUrl(url) {
  return axios({
    method: 'get', url: url, maxRedirects: 0, validateStatus: (status) => status === 302,
  })
      .then((res) => {
        const did = res.headers['set-cookie'][0].match(/(?<=did=)\S*(?=; )/g)[0]
        const didv = res.headers['set-cookie'][1].match(/(?<=didv=)\S*(?=; )/g)[0]
        return {
          did: did, didv: didv, location: res.headers.location
        }
      })
      .catch((err) => {
        console.log(err);
      });
}

function getDataInfo(url, did, didv) {
  // 获取 url 中的 videoId
  let photoId = url.match(/(?<=photoId=)\S*(?=&shareId)/g);
  if (photoId) {
    photoId = photoId[0];
  } else {
    photoId = url.match(/(?<=short-video\/|long-video\/|photo\/)\S*(?=\?fid)/g);
    if (photoId) {
      photoId = photoId[0];
    }
  }
  return axios({
    method: 'post', url: 'https://v.m.chenzhongtech.com/rest/wd/photo/info', timeout: 8000, data: {
      photoId: photoId, isLongVideo: false,
    }, headers: {
      Cookie: `did=${did}; didv=${didv}; kpf=PC_WEB; kpn=KUAISHOU_VISION`,
      Referer: url,
      Host: 'v.m.chenzhongtech.com',
      'Content-Type': 'application/json',
    },
  }).then(res => {
    return {
      code: 0, message: '快手视频解析成功', data: {
        title: res.data.photo.caption,
        author: res.data.photo.userName,
        avatar: res.data.photo.headUrl,
        cover: res.data.photo.coverUrls[0].url,
        music: res.data.photo.soundTrack.audioUrls[0].url,
        video: res.data.photo.mainMvUrls[0].url
      },
    };
  }).catch(err => {
    console.log(err);
    return {
      code: 1, message: '快手视频解析失败',
    };
  });
}

module.exports = {
  getRedirectUrl, getDataInfo
}