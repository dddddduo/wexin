<template>
  <div id="face_auth">
    <div class="inner_logo">
      <img src="../../../assets/user_app/auth_face.png" alt="">
    </div>
    <div class="info">
      <p>即将对<span>{{innerName}}</span>进行人脸识别认证，请保持周围灯光明亮，整个过程将进行大约1分钟。</p>
      <div class="inner_wrap"></div>
      <div class="btn">
        <button type="button" @click="handleAuth">开始认证</button>
        <button type="button" @click="handleBack">以后再说</button>
      </div>
    </div>
    <div class="face_video" v-show="showVideo">
      <h4>{{infoTip}}</h4>
      <video src="" ref="video"></video>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FaceAuth',
  data: () => ({
    innerName: '',
    innerId: '',
    faceStream: false,
    // 视频流
    mediaStream: '',
    recorderFile: '',
    infoTip: '整个过程大约进行15秒左右',
    showVideo: false
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '人脸识别'
  },
  mounted () {
    this.innerName = this.$route.query.name
    this.innerId = this.$route.query.id
  },
  methods: {
    handleAuth () {
      const that = this
      if (navigator.mediaDevices) {
        const loading = this.$wechat.loading('启动中')
        navigator.mediaDevices.getUserMedia(
          {
            audio: false,
            video: {
              facingMode: 'user',
              width: window.screen.width,
              height: window.screen.height
            }
          }).then(um => {
          var video = document.querySelector('video')
          video.srcObject = um
          video.play()
          that.showVideo = true
          // 声明录制器
          let re = new window.MediaRecorder(um)
          re.blobs = []
          let chunks = []
          // 开始录制
          re.onstart = function () {
            loading.hide()
          }
          // 获取录制信息
          re.ondataavailable = function (e) {
            re.blobs.push(e.data)
            chunks.push(e.data)
          }
          // 停止录制，上传视频
          re.onstop = function (e) {
            that.recorderFile = new Blob(chunks, {'type': 'video/mp4'})
            let file = new File([that.recorderFile], 'msr-' + (new Date()).toISOString().replace(/:|\./g, '-') + '.mp4', {'type': 'video/mp4'})
            that.file = file
            that.handleUpload(file)
            // 关闭媒体流
            // that.handleCloseStream(um)
          }
          re.start()
          // 录制过程
          that.handleTimer(re)
        }).catch(() => {
          loading.hide()
          that.$wechat.topTips('网络错误')
        })
      } else {
        that.$wechat.topTips('设备或网络不支持智能识别')
      }
    },
    handleCloseStream: function (stream) {
      if (typeof stream.stop === 'function') {
        stream.stop()
      } else {
        let trackList = [stream.getAudioTracks(), stream.getVideoTracks()]
        for (let i = 0; i < trackList.length; i++) {
          let tracks = trackList[i]
          if (tracks && tracks.length > 0) {
            for (let j = 0; j < tracks.length; j++) {
              let track = tracks[j]
              if (typeof track.stop === 'function') {
                track.stop()
              }
            }
          }
        }
      }
    },
    handleBack () {
      if (this.$route.query.from) {
        this.$router.push('/account/agent')
      } else {
        this.$router.push({
          path: '/account/agent'
        })
      }
    },
    handleTimer (re, s) {
      let i = s || 12
      const that = this
      let timer = setInterval(() => {
        if (i === 10) {
          that.infoTip = '请转动眼睛'
        } else if (i === 5) {
          that.infoTip = '请张开嘴巴'
        } else if (i === 0) {
          // that.infoTip = '审核中'
          that.showVideo = false
          re.stop()
          clearInterval(timer)
        }
        i--
      }, 1000)
    },
    handleUpload (file) {
      const that = this
      let loading = that.$wechat.loading('认证中...')
      let upload = new FormData()
      let timestamp = new Date().getTime()
      upload.append('file', file)
      upload.append('type', '视频认证')
      upload.append('timestamp', timestamp)
      that.$ajax.post('/sw/file/upload', upload).then(res => {
        if (res.data.code === 200) {
          let data = new FormData()
          data.append('video', res.data.data.fileUrl)
          data.append('aId', that.$route.query.id)
          that.$ajax.post('/sw/company/responsible/person/video/auth', data).then(res1 => {
            loading.hide()
            if (res1.data.code === 200) {
              that.$router.push({
                path: '/account/agent_detail',
                query: {
                  id: that.$route.query.id
                }
              })
            } else {
              that.$wechat.topTips(res1.data.message)
              that.$wechat.toast(res1.data.message, {
                duration: 900,
                callback: function () {
                  that.$router.push({
                    path: '/account/agent_detail',
                    query: {
                      id: that.$route.query.id,
                      name: that.$route.query.name
                    }
                  })
                }
              })
            }
          })
        } else {
          that.$wechat.topTips(res.data.message)
        }
        loading.hide()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.face_video {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  h4 {
    color: $theme-b;
    font-size: 36px; /*px*/
    position: absolute;
    top: rem(50px);
    width: 100%;
    text-align: center;
    z-index: 3;
  }
}
#face_auth {
  padding: rem(40px) 0;
  .inner_logo {
    width: rem(96px);
    height: rem(96px);
    display:flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    border-radius : 50%;
    background: $theme-b;
    opacity: .88;
    img {
      width: rem(72px);
    }
  }
  .info {
    p {
      padding: 0 rem(40px);
      margin: rem(20px) 0 rem(35px) 0;
      font-size: 32px; /*px*/
      color: $theme-word;
      span {
        font-weight: bold;
      }
    }
    .btn {
      // margin-top: rem(200px);
      padding: 0 rem(30px);
      button {
        width: 100%;
        height: $buttonHeight;
        line-height: $buttonHeight;
        border: none;
        background: $theme;
        border-radius: 10px; /*px*/
        color: #fff;
        outline: none;
        font-size: 32px;/*px*/
      }
      button:last-child {
        margin-top: rem(10px);
        background: #fff;
        color: $theme-word;
        border: 2px solid #ccc; /*px*/
      }
    }
  }
}
</style>
