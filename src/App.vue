<template lang="pug">
  .container-fluid.mono-text.v-100.h-100.p-0(ref="board")
    .settings-page.bg-dark(v-if="isSettingsShow")
      .container.p-0
        b-card(no-body='')
          b-tabs(card style="font-size: 1.5em")
            b-tab(title='Ball Pool & Result' default)
              .row.h-100
                .col.h-100
                  .row.h-100.pb-0(style="overflow-y: scroll")
                    .col-2.p-1(v-for="b in ballPool")
                      b-button(block variant='outline-light') {{ b }}
                .col.h-100
                  .row.h-100.pb-0(style="overflow-y: scroll")
                    .col.h-100
                      .row(v-for="(list, i) in results")
                        .col-2.p-1.text-center {{ i+1 }}
                        .col-2.p-1(v-for="b in list")
                          b-button(block variant='info') {{ b }}
            b-tab(title='Info')
              div
                b-badge(variant='warning') Q 
                span.ml-3 Cover the card
              div
                b-badge(variant='warning') W 
                span.ml-3 Enable/Disable fullscreen
              div
                b-badge(variant='warning') E
                span.ml-3 Enable/Disable opening page
              div
                b-badge(variant='warning') R 
                span.ml-3 Wash card
              div
                b-badge(variant='warning') T 
                span.ml-3 Reset ball pool
              div
                b-badge(variant='warning') S 
                span.ml-3 Open/Close settings
              div
                b-badge(variant='warning') Space 
                span.ml-3 Draw & Turn over the cards
    img.settings(src='@/assets/img/settings.png' @click="toggleSettings()")
    .draw-info {{ ballPool.length }}
    .card-box.m-3(v-for="(c, i) in cardList" :class="{ 'opened': c.isOpened }" :style="[c.style]")
      .card-front(:style="`background-image: url(${cardFrontImg})`")
        .card-number-text.d-flex.justify-content-center.align-items-center.h-100 {{ c.number }}
      .card-back.p-1(:style="`background-image: url(${cardBackImg})`")
    transition
      video.v-bg.v-open(v-if="isOpenShow" autoplay='true' loop='true')
        source(src='@/assets/video/main.mp4' type='video/mp4')
    transition
      video.v-bg.v-loop(autoplay='true' loop='true')
        source(src='@/assets/video/loop.mp4' type='video/mp4')
</template>

<script>
const { remote } = require('electron')

export default {
  data() {
    return {
      isOpenShow: false,
      isSettingsShow: false,
      isFullScreen: true,
      cardAmount: 6,
      cardList: [],
      state: true,
      cardFrontImg: require('@/assets/img/card_front.png'),
      cardBackImg: require('@/assets/img/card_back.png'),
      ballPool: [],
      results: [],
      currentResult: []
    }
  },
  mounted() {
    window.addEventListener('keyup', this.handleKeyup)

    this.resetBallPool()
    this.drawSettings()
    this.drawCard()
  },
  destroyed() {
    window.removeEventListener('keyup', this.handleKeyup)
  },
  methods: {
    handleKeyup(e) {
      console.log(e.keyCode)
      switch (e.keyCode) {
        case 87: // w
          console.log('Fullscreen: ', this.isFullScreen)
          this.fullScreen()
          break
        case 32: // space
          console.log('Space: Open cards')
          this.openAll()
          break
        case 81: // q
          console.log('Q: Close cards')
          this.closeAll()
          break
        case 69: // e
          console.log('E: Toogle opening video')
          this.isOpenShow = !this.isOpenShow
          break
        case 82: // r
          console.log('R: Wash cards')
          this.washCard()
          break
        case 83: // s
          console.log('S: Open settings')
          this.toggleSettings()
          break
        case 84: // t
          console.log('T: Reset ball pool')
          this.resetBallPool()
          break
        default:
          console.log('do nothing')
      }
    },
    fullScreen() {
      const w = remote.getCurrentWindow()
      w.setFullScreen(this.isFullScreen)
      this.isFullScreen = !this.isFullScreen

      setTimeout(() => {
        this.drawCard()
      }, 1)
    },
    resetBallPool() {
      this.ballPool = []
      this.results = []
      for (let b = 1; b <= 110; b++) {
        this.ballPool.push(b)
      }
    },
    drawSettings() {
      const winSize = {
        height: this.$refs.board.clientHeight,
        width: this.$refs.board.clientWidth
      }

      const w = winSize.width * 0.8
      const h = winSize.height * 0.9

      this.settingsStyle = {
        width: w + 'px',
        height: h + 'px',
        'margin-top': '-' + h / 2 + 'px',
        'margin-left': '-' + w / 2 + 'px'
      }
    },
    drawCard() {
      const winSize = {
        height: this.$refs.board.clientHeight,
        width: this.$refs.board.clientWidth
      }

      const boardR = winSize.width
      const boardX = winSize.width / 2

      const cardW = winSize.width / 11
      const cardH = cardW * 1.5
      const boardGap = boardR * 0.15
      const rowAmount = [6, 5]
      const heightGap = [90, 30, 0, 0, 30, 90, 90, 30, 5, 30, 90]
      const roate = [-20, -12, -4, 4, 12, 20, -20, -12, 0, 12, 20]

      if (this.cardList.length <= 0) {
        rowAmount.forEach((amount, k) => {
          for (let i = 0; i < amount; i++) {
            const cardIndex = this.cardList.length
            const x = boardX - ((cardW + 32) * amount) / 2 + i * (cardW + 32)
            const y = boardGap + heightGap[cardIndex] + k * cardH + k * 20
            let card = {
              isOpened: false,
              number: 0,
              degree: roate[cardIndex],
              width: cardW,
              height: cardH,
              amount: amount,
              x,
              y,
              style: {
                width: cardW + 'px',
                height: cardH + 'px',
                top: y + 'px',
                left: x + 'px',
                'transform-origin': 'bottom center',
                transform: 'rotate(' + roate[cardIndex] + 'deg)'
              }
            }
            this.cardList.push(card)
          }
        })
      } else {
        rowAmount.forEach((amount, k) => {
          for (let i = 0; i < amount; i++) {
            let cardIndex = i + k * amount
            if (k > 0) {
              cardIndex += 1
            }
            this.cardList[cardIndex]
            const x = boardX - ((cardW + 32) * amount) / 2 + i * (cardW + 32)
            const y = boardGap + heightGap[cardIndex] + k * cardH + k * 20
            this.cardList[cardIndex].width = cardW
            this.cardList[cardIndex].height = cardH
            this.cardList[cardIndex].x = x
            this.cardList[cardIndex].y = y
            this.cardList[cardIndex].style.width = cardW + 'px'
            this.cardList[cardIndex].style.height = cardH + 'px'
            this.cardList[cardIndex].style.top = y + 'px'
            this.cardList[cardIndex].style.left = x + 'px'
          }
        })
      }
    },
    toggleSettings() {
      this.isSettingsShow = !this.isSettingsShow
    },
    washCard() {
      const winSize = {
        height: this.$refs.board.clientHeight,
        width: this.$refs.board.clientWidth
      }

      const boardX = winSize.width / 2
      const boardGap = winSize.width * 0.15

      this.cardList.forEach((card, k) => {
        this.cardList[k].style.top = boardGap + this.cardList[k].height + 'px'
        this.cardList[k].style.left = boardX - (this.cardList[k].width + 32) / 2 + 'px'
        this.cardList[k].style.transform = 'rotate(0deg)'
      })

      setTimeout(() => {
        this.cardList.forEach((card, k) => {
          this.cardList[k].style.top = this.cardList[k].y + 'px'
          this.cardList[k].style.left = this.cardList[k].x + 'px'
          this.cardList[k].style.transform = 'rotate(' + this.cardList[k].degree + 'deg)'
        })
      }, 1000)
    },
    toogleCard(cardIndex, isOpen) {
      if (!this.cardList[cardIndex].isOpened) {
        this.cardList[cardIndex].number = this.currentResult[cardIndex]
      }
      this.cardList[cardIndex].isOpened = isOpen
      const card = this.cardList[cardIndex]
      if (this.cardList[cardIndex].isOpened) {
        this.cardList[cardIndex].style.transform = 'rotate(' + card.degree + 'deg) rotateY(180deg)'
      } else {
        this.cardList[cardIndex].style.transform = 'rotate(' + card.degree + 'deg)'
      }
    },
    openAll() {
      if (!this.state || this.cardList[0].isOpened || this.isOpenShow) {
        return
      }

      if (this.ballPool.length <= 0) {
        alert('Oops! 球池已經空了!')
        return
      }

      this.state = false
      this.currentResult = []
      this.washCard()
      setTimeout(() => {
        this.cardList.forEach((card, k) => {
          this.currentResult.push(this.getRandNumber())
          setTimeout(() => {
            this.toogleCard(k, true)
          }, 500 * k)
          setTimeout(() => {
            this.state = true
          }, this.cardList.length * 500)
        })
        this.results.push(this.currentResult)
      }, 1200)
    },
    closeAll() {
      if (!this.state || !this.cardList[0].isOpened) {
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

<style type="scss">
@import url('https://fonts.googleapis.com/css?family=Nova+Mono|Odibee+Sans&display=swap');

@keyframes box {
  0% {
    top: -10px;
  }
  50% {
    top: 10px;
  }
  100% {
    top: -10px;
  }
}

.mono-text {
  font-family: 'Nova Mono', monospace;
}

.draw-info {
  position: fixed;
  top: 18%;
  left: 50%;
  text-align: center;
  width: 600px;
  margin-left: -300px;
  color: white;

  z-index: 3;
}

.card-box {
  position: fixed;
  transform-style: preserve-3d;
  transition: 0.5s all ease;
  z-index: 3 !important;
}

.card-back {
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
  background-size: 100% 100%;
  background-position: center center;
  border-radius: 5px;

  animation: box 5s infinite;
}

.card-front {
  position: absolute;
  height: 100%;
  width: 100%;
  background-size: 100% 100%;
  background-position: center center;
  background-color: white;
  border-radius: 5px;

  transform: rotateY(180deg);

  animation: box 5s infinite;
}

.card-number-text {
  position: absolute;
  width: 100%;
  font-size: 90px;
  padding-top: 10px;
  text-align: center;
  color: #eea65b !important;

  font-family: 'Odibee Sans', cursive;
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

.settings-page {
  position: fixed;
  border: 2px solid #eea65b;
  border-radius: 20px;
  top: 50%;
  left: 50%;
  width: 1024px;
  height: 648px;
  margin-top: -324px;
  margin-left: -512px;
  z-index: 5;

  overflow: hidden;
}

.tab-content,
.tab-pane {
  border: 0px;
  height: 580px !important;
}

.v-leave {
  opacity: 1;
}
.v-leave-active {
  transition: opacity 1s;
}
.v-leave-to {
  opacity: 0;
}
.v-enter {
  opacity: 0;
}
.v-enter-active {
  transition: opacity 1s;
}
.v-enter-to {
  opacity: 1;
}
</style>
