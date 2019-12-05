<template lang="pug">
  .container-fluid.h-100.p-0(ref="board")
    video.v-loop(autoplay='true' loop='true')
      source(src='@/assets/video/02_Loop_1.mp4' type='video/mp4')
    .card-box.m-3(v-for="(c, i) in cardList" :class="{ 'opened': c.isOpened }" :style="[c.style]" @click="toogleCard(i)")
      .card-number-blank(:style="`background-image: url(${cardBlankImg})`")
        .card-number-text.text-primary.d-flex.justify-content-center.align-items-center.h-100 {{ c.number }}
      .card-number.p-1(:style="`background-image: url(${cardImg})`")  
</template>

<script>
const { remote } = require('electron')

export default {
  data() {
    return {
      isFullScreen: true,
      cardAmount: 6,
      cardList: [],
      state: true,
      cardBlankImg: require('@/assets/img/card-board.png'),
      cardImg: require('@/assets/img/cb.png')
    }
  },
  mounted() {
    window.addEventListener('keyup', this.handleKeyup)

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
          console.log('fullscreen: ', this.isFullScreen)
          this.fullScreen()
          break
        case 32: // space
          console.log('open all card')
          this.openAll()
          break
        case 27: // esc
          console.log('close all card')
          this.closeAll()
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
    drawCard() {
      this.cardList = []
      const winSize = {
        height: this.$refs.board.clientHeight,
        width: this.$refs.board.clientWidth
      }

      const boardR = winSize.width
      const boardX = winSize.width / 2

      const cardW = winSize.width / 11
      const cardH = cardW * 1.5
      let degree = -19.5
      const boardGap = boardR * 0.16
      const heightGap = [75, 25, 0, 0, 25, 75]
      const heightGap2 = [70, 20, 0, 20, 70]

      for (let i = 0; i < this.cardAmount; i++) {
        let card = {
          isOpened: false,
          number: 0,
          degree,
          style: {
            width: cardW + 'px',
            height: cardH + 'px',
            top: boardGap + heightGap[i] + 'px',
            left: boardX - (cardW + 32) * (this.cardAmount / 2) + i * (cardW + 32) + 'px',
            'transform-origin': 'bottom center',
            transform: 'rotate(' + degree + 'deg)'
          }
        }
        degree += 8
        this.cardList.push(card)
      }

      degree = -19.5
      for (let i = 0; i < this.cardAmount - 1; i++) {
        let card = {
          isOpened: false,
          number: 0,
          degree,
          style: {
            width: cardW + 'px',
            height: cardH + 'px',
            top: boardGap + cardH + heightGap2[i] + 30 + 'px',
            left: boardX - (cardW + 32) * ((this.cardAmount - 1) / 2) + i * (cardW + 32) + 'px',
            'transform-origin': 'bottom center',
            transform: 'rotate(' + degree + 'deg)'
          }
        }
        degree += 10
        this.cardList.push(card)
      }
    },
    toogleCard(cardIndex, isOpen) {
      if (!this.cardList[cardIndex].isOpened) {
        this.cardList[cardIndex].number = this.getRand(1, 110)
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
      if (!this.state || this.cardList[0].isOpened) {
        return
      }

      this.state = false
      this.cardList.forEach((card, k) => {
        setTimeout(() => {
          this.toogleCard(k, true)
        }, 500 * k)
        setTimeout(() => {
          this.state = true
        }, this.cardList.length * 500)
      })
    },
    closeAll() {
      if (!this.state || !this.cardList[0].isOpened) {
        return
      }

      this.state = false
      this.cardList.forEach((card, k) => {
        this.toogleCard(k, false)
        setTimeout(() => {
          this.state = true
        }, 2000)
      })
    },
    getRand(min, max) {
      return Math.floor(Math.random() * max) + min
    }
  }
}
</script>

<style type="scss">
@import url('https://fonts.googleapis.com/css?family=Odibee+Sans&display=swap');

.card-box {
  display: inline-block;
  position: fixed;

  transform-style: preserve-3d;
  transition: 0.5s all ease;
}

.card-number {
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
  background-size: 100% 100%;
  background-position: center center;
  border-radius: 5px;
}

.card-number-blank {
  position: absolute;
  height: 100%;
  width: 100%;
  background-size: 100% 100%;
  background-position: center center;
  background-color: white;
  border-radius: 5px;

  transform: rotateY(180deg);
}

.card-number-text {
  position: absolute;
  width: 100%;
  font-size: 70px;
  padding-top: 10px;
  text-align: center;

  font-family: 'Odibee Sans', cursive;
}

.board {
  position: fixed;
  top: 0px;
  left: 0px;
}

.v-loop {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.v-open {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
</style>
