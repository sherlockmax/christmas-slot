<template lang="pug">
  .container-fluid.h-100
    .row
      .col
    .row.h-100
      .col.h-100
        .d-flex.justify-content-center.align-items-center.h-100
          .card-box.m-1(v-for="(c, i) in cardList" :class="{ 'opened': c.isOpened }" @click="toogleCard(i)")
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
      cardAmount: 10,
      cardList: [],
      state: true,
      cardBlankImg: require('@/assets/img/card-board.png'),
      cardImg: require('@/assets/img/cb.png')
    }
  },
  mounted() {
    window.addEventListener('keyup', this.handleKeyup)
    for (let i = 1; i <= this.cardAmount; i++) {
      let card = {
        isOpened: false,
        number: 0
      }
      this.cardList.push(card)
    }
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
        default:
          console.log('do nothing')
      }
    },
    fullScreen() {
      const w = remote.getCurrentWindow()
      w.setFullScreen(this.isFullScreen)
      this.isFullScreen = !this.isFullScreen
    },
    toogleCard(cardIndex) {
      if (!this.cardList[cardIndex].isOpened) {
        this.cardList[cardIndex].number = this.getRand(1, 110)
      }
      this.cardList[cardIndex].isOpened = !this.cardList[cardIndex].isOpened
    },
    openAll() {
      if (!this.state) {
        return
      }

      this.state = false
      this.cardList.forEach((card, k) => {
        setTimeout(() => {
          this.toogleCard(k)
        }, 500 * k)
        setTimeout(() => {
          this.state = true
        }, this.cardAmount * 500)
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
  width: 10%;
  height: 25%;
  display: inline-block;
  position: relative;

  transform-style: preserve-3d;
  transition: 1s all ease;
}

.card-box.opened {
  transform: rotateY(180deg);
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
</style>
