<template lang="pug">
  .container-fluid.mono-text.v-100.h-100.p-0(ref="board")
    Settings(v-if="isSettingsShow" :results="results" :ballPool="ballPool")
    img.settings(src='@/assets/img/settings.png' @click="toggleSettings()")
    .draw-info 
      div Round {{ this.results.length }}
      div {{ ballPool.length }} / {{ totalBallPool }}
    transition(v-for="(c, i) in cardList" :key="`card_` + i")
      Card(:customStyle="c.style" :number="c.number" :isOpened="c.isOpened" :numberStyle="c.numberStyle" :cardSize="{width: c.cardW, height: c.cardH}")
    transition
      video.v-bg.v-open(v-if="isOpenShow" autoplay='true' loop='true')
        source(src='@/assets/video/main.mp4' type='video/mp4')
    transition
      video.v-bg.v-loop(autoplay='true' loop='true')
        source(src='@/assets/video/loop.mp4' type='video/mp4')
</template>

<script>
const { remote } = require('electron')
import Card from './views/Card'
import Settings from './views/Setting'

export default {
  components: { Card, Settings },
  data() {
    return {
      isOpenShow: false,
      isSettingsShow: false,
      isFullScreen: true,
      cardAmount: 11,
      maxPerLine: 6,
      cardList: [],
      state: true,
      ballPool: [],
      results: [],
      currentResult: [],
      totalBallPool: 0
    }
  },
  mounted() {
    const w = remote.getCurrentWindow()
    this.isFullScreen = !w.isFullScreen()

    this.resetBallPool()
    this.drawCard()

    window.addEventListener('keyup', this.handleKeyup)
  },
  destroyed() {
    window.removeEventListener('keyup', this.handleKeyup)
  },
  methods: {
    handleKeyup(e) {
      switch (e.keyCode) {
        case 87: // w
          this.fullScreen()
          break
        case 32: // space
          this.openAll()
          break
        case 81: // q
          this.closeAll()
          break
        case 69: // e
          this.isOpenShow = !this.isOpenShow
          break
        case 82: // r
          this.washCard()
          break
        case 83: // s
          this.toggleSettings()
          break
        case 84: // t
          this.resetBallPool()
          break
      }
    },
    fullScreen() {
      const w = remote.getCurrentWindow()
      w.setFullScreen(this.isFullScreen)
      this.isFullScreen = !this.isFullScreen
      setTimeout(() => {
        this.drawCard()
      }, 1000)
    },
    resetBallPool() {
      this.ballPool = []
      this.results = []
      for (let b = 1; b <= 110; b++) {
        this.ballPool.push(b)
      }
      this.totalBallPool = this.ballPool.length
    },
    drawCard() {
      const winSize = {
        height: this.$refs.board.clientHeight,
        width: this.$refs.board.clientWidth
      }

      const cardW = winSize.width * 0.1
      const cardH = cardW * 1.5
      const x = Math.sqrt(Math.pow(winSize.width / 2, 2) * 2) / 2 + cardW - 4
      const y = winSize.height + winSize.width * 0.13

      let fontSize = 70
      if (!this.isFullScreen) {
        fontSize = 110
      }

      if (this.cardList.length <= 0) {
        for (let i = 0; i < this.cardAmount; i++) {
          const index = this.cardList.length % this.maxPerLine
          const currentLine = Math.floor(this.cardList.length / this.maxPerLine)
          const leftAmount = this.cardAmount - 1 - currentLine * this.maxPerLine
          const amountPerLine = leftAmount > this.maxPerLine ? this.maxPerLine - 1 : leftAmount
          const r = (80 * index) / amountPerLine + 50
          let h = winSize.height * -1 + currentLine * cardH
          if (currentLine > 0) {
            h += 20
          }
          const card = {
            r,
            h,
            x: x,
            y: y,
            cardW,
            cardH,
            number: 0,
            isOpened: false,
            style: {
              'z-index': 3,
              width: cardW + 'px',
              height: cardH + 'px',
              transform:
                'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg) translate(' + h + 'px) rotateZ(-90deg)'
            },
            numberStyle: {
              'font-size': fontSize + 'px'
            }
          }

          this.cardList.push(card)
        }
      } else {
        this.cardList.forEach((card, k) => {
          const index = k % this.maxPerLine
          const currentLine = Math.floor(k / this.maxPerLine)
          const leftAmount = this.cardAmount - 1 - currentLine * this.maxPerLine
          const amountPerLine = leftAmount > this.maxPerLine ? this.maxPerLine - 1 : leftAmount
          const r = (80 * index) / amountPerLine + 50
          let h = winSize.height * -1 + currentLine * cardH
          if (currentLine > 0) {
            h += 20
          }
          this.cardList[k].r = r
          this.cardList[k].h = h
          this.cardList[k].x = x
          this.cardList[k].y = y
          this.cardList[k].cardW = cardW
          this.cardList[k].cardH = cardH
          this.cardList[k].style = {
            'z-index': 3,
            width: cardW + 'px',
            height: cardH + 'px',
            transform: 'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg) translate(' + h + 'px) rotateZ(-90deg)'
          }
          this.cardList[k].numberStyle = {
            'font-size': fontSize + 'px'
          }
        })
      }
    },
    toggleSettings() {
      this.isSettingsShow = !this.isSettingsShow
    },
    washCard() {
      if (this.cardList[0].isOpened || this.isOpenShow) {
        return
      }

      this.cardList.forEach((card, k) => {
        this.cardList[k].style.transform =
          'translate(' + card.x + 'px, ' + card.y + 'px) rotate(90deg) translate(' + card.h + 'px) rotateZ(-90deg)'
      })

      setTimeout(() => {
        this.cardList.forEach((card, k) => {
          this.cardList[k].style.transform =
            'translate(' +
            card.x +
            'px, ' +
            card.y +
            'px) rotate(' +
            card.r +
            'deg) translate(' +
            card.h +
            'px) rotateZ(-90deg)'
        })
      }, 1500)
    },
    toogleCard(cardIndex, isOpen) {
      if (!this.cardList[cardIndex].isOpened) {
        this.cardList[cardIndex].number = this.currentResult[cardIndex]
      }
      this.cardList[cardIndex].isOpened = isOpen
    },
    openAll() {
      if (!this.state || this.cardList[0].isOpened || this.isOpenShow) {
        return
      }

      this.state = false
      this.currentResult = []
      this.washCard()
      setTimeout(() => {
        this.cardList.forEach((card, k) => {
          setTimeout(() => {
            this.currentResult.push(this.getRandNumber())
            this.toogleCard(k, true)
          }, 500 * k)
          setTimeout(() => {
            this.state = true
          }, this.cardList.length * 500)
        })
        this.results.push(this.currentResult)
      }, 2500)
    },
    closeAll() {
      if (!this.state || !this.cardList[0].isOpened || this.isOpenShow) {
        return
      }

      this.state = false
      this.cardList.forEach((card, k) => {
        this.toogleCard(k, false)
      })

      setTimeout(() => {
        this.state = true
      }, 500)
    },
    getRandNumber() {
      if (this.ballPool.length <= 0) {
        return 0
      }

      const max = this.ballPool.length
      const index = Math.floor(Math.random() * max)
      const result = this.ballPool[index]
      this.ballPool.splice(index, 1)

      return result
    }
  }
}
</script>

<style type="scss" scoped>
.draw-info {
  position: fixed;
  bottom: 20px;
  left: 50%;
  text-align: center;
  width: 600px;
  margin-left: -300px;
  color: white;
  font-size: 30px;

  z-index: 3;
}

.settings {
  z-index: 6;
  position: fixed;
  right: 10px;
  bottom: 10px;
  width: 40px;
  opacity: 0.3;
}

.settings:hover {
  opacity: 0.5;
}

.settings:active {
  opacity: 0.4;
}

.v-bg {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.v-loop {
  z-index: 0;
}

.v-open {
  z-index: 4;
}
</style>
