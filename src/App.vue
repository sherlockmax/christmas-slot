<template lang="pug">
  .container-fluid.mono-text.v-100.h-100.p-0(ref="board")
    .loading-page.d-flex.justify-content-center.align-items-center(v-if="isLoading")
      video.v-bg.v-open(autoplay='true' loop='true')
        source(src='@/assets/video/main.mp4' type='video/mp4')
    transition
      video.v-bg.v-open(v-if="isOpenShow" autoplay='true' loop='true')
        source(src='@/assets/video/main.mp4' type='video/mp4')
    transition
      video.v-bg.v-loop(autoplay='true' loop='true')
        source(src='@/assets/video/loop.mp4' type='video/mp4')
    Settings(
      v-if="isSettingsShow"
      :cardsPerDraw="cardsPerDraw"
      :results="results"
      :drewBallPool="drewBallPool"
      :ballPoolMin="ballPoolMin"
      :ballPoolMax="ballPoolMax"
      :filePath="this.store.getPath()"
      @updated="settingsUpdated"
    )
    img.settings(src='@/assets/img/settings.png' @click="toggleSettings()")
    transition
      .key-info(v-if="isOpenShow")
        div Press 'E' to start
    .draw-info 
      div
        .round.bg-warning.text-dark(
          v-for="r in (1, this.results.length)" 
          @click="playResult(r-1)" 
          :class="{'bg-white text-dark' : currentResultIndex == r}"
        ) {{ r }}
      div {{ ballPool.length }} / {{ totalBallPool }}
    Card(
      v-for="(c, i) in cardList" 
      :key="`card_` + i + `_` + cardsPerDraw" 
      :customStyle="c.style" 
      :number="c.number" 
      :isOpened="c.isOpened" 
      :numberStyle="c.numberStyle" 
      :cardSize="{width: c.cardW, height: c.cardH}"
    )
</template>

<script>
const { remote } = require('electron')
import Store from './app/store'
import Card from './components/Card'
import Settings from './components/Setting'

export default {
  components: { Card, Settings },
  data() {
    return {
      isLoading: true,
      isOpenShow: true,
      isSettingsShow: false,
      isFullScreen: false,
      cardList: [],
      state: true,
      cardsPerDraw: 11,
      ballPoolMin: 1,
      ballPoolMax: 110,
      ballPool: [],
      drewBallPool: [],
      results: [],
      currentResult: [],
      currentResultIndex: 0,
      totalBallPool: 0,
      store: null
    }
  },
  mounted() {
    // First instantiate the class
    this.store = new Store({
      // We'll call our data file 'user-preferences'
      configName: 'user-preferences',
      defaults: {
        cardsPerDraw: 11,
        ballPoolMin: 1,
        ballPoolMax: 110,
        totalBallPool: 110,
        ballPool: [],
        drewBallPool: [],
        results: []
      }
    })

    this.cardsPerDraw = this.store.get('cardsPerDraw')
    this.ballPoolMin = this.store.get('ballPoolMin')
    this.ballPoolMax = this.store.get('ballPoolMax')
    this.ballPool = this.store.get('ballPool')
    this.drewBallPool = this.store.get('drewBallPool')
    this.results = this.store.get('results')
    this.totalBallPool = this.store.get('totalBallPool')
    this.currentResultIndex = this.results.length
    const w = remote.getCurrentWindow()
    this.isFullScreen = !w.isFullScreen()

    if (this.ballPool.length <= 0) {
      this.resetBallPool()
    }
    this.drawCard()

    window.addEventListener('keyup', this.handleKeyup)

    this.isLoading = false
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
          if (this.isSettingsShow) {
            return
          }
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
      this.isLoading = true
      const w = remote.getCurrentWindow()
      w.setFullScreen(this.isFullScreen)
      this.isFullScreen = !this.isFullScreen
      setTimeout(() => {
        this.drawCard()
      }, 1000)
      setTimeout(() => {
        this.isLoading = false
      }, 1800)
    },
    resetBallPool() {
      this.ballPool = []
      this.results = []
      for (let b = this.ballPoolMin; b <= this.ballPoolMax; b++) {
        this.ballPool.push(b)
      }
      this.totalBallPool = this.ballPool.length

      this.saveData()
    },
    drawCard() {
      const winSize = {
        height: this.$refs.board.clientHeight,
        width: this.$refs.board.clientWidth
      }

      const cardW = winSize.width * 0.1
      const cardH = cardW * 1.5
      const x = Math.sqrt(Math.pow(winSize.width / 2, 2) * 2) / 2 + cardW - 4
      let y = winSize.height + winSize.width * 0.12

      let fontSize = 70
      if (!this.isFullScreen) {
        fontSize = 110
      }

      let maxPerLine = 5
      if (this.cardsPerDraw == 11 || this.cardsPerDraw == 6) {
        maxPerLine = 6
      }

      let angle = 80
      if (this.cardsPerDraw <= 4) {
        angle = 40
      }

      if (this.cardsPerDraw <= maxPerLine) {
        y = winSize.height + winSize.width * 0.21
      }

      if (this.cardList.length <= 0) {
        for (let i = 0; i < this.cardsPerDraw; i++) {
          const index = this.cardList.length % maxPerLine
          const currentLine = Math.floor(this.cardList.length / maxPerLine)
          const leftAmount = this.cardsPerDraw - 1 - currentLine * maxPerLine
          const amountPerLine = leftAmount > maxPerLine ? maxPerLine - 1 : leftAmount
          const r = this.cardsPerDraw == 1 ? 90 : (angle * index) / amountPerLine + ((60 - angle) / 2 + 60)
          // 100:50 90:45 80:50 70:55 60:60 50:65 40:70 30:75 20:80
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
          const index = k % maxPerLine
          const currentLine = Math.floor(k / maxPerLine)
          const leftAmount = this.cardsPerDraw - 1 - currentLine * maxPerLine
          const amountPerLine = leftAmount > maxPerLine ? maxPerLine - 1 : leftAmount
          const r = this.cardsPerDraw == 1 ? 90 : (angle * index) / amountPerLine + ((60 - angle) / 2 + 60)
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
      if (this.isOpenShow) {
        return
      }

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
    openAll(playResults) {
      if (!this.state || this.cardList[0].isOpened || this.isOpenShow || this.ballPool.length <= 0) {
        return
      }

      this.state = false
      this.currentResult = []
      let waitWashCard = 100
      if (this.cardsPerDraw > 1) {
        this.washCard()
        waitWashCard = 2500
      }
      setTimeout(() => {
        this.cardList.forEach((card, k) => {
          setTimeout(() => {
            let result = 0
            if (playResults && playResults[k]) {
              result = playResults[k]
            } else {
              result = this.getRandNumber()
            }
            this.currentResult.push(result)
            this.toogleCard(k, true)
          }, 500 * k)
        })
        if (playResults == null) {
          this.results.push(this.currentResult)
          this.currentResultIndex = this.results.length
        }

        setTimeout(() => {
          this.state = true
          this.saveData()
          console.log(this.state)
        }, this.cardsPerDraw * 550)
      }, waitWashCard)
    },
    playResult(resultsIndex) {
      if (!this.state) {
        return
      }
      if (this.cardList[0].isOpened) {
        this.closeAll()
        setTimeout(() => {
          this.openAll(this.results[resultsIndex])
        }, 1000)
      } else {
        this.openAll(this.results[resultsIndex])
      }
      this.currentResultIndex = resultsIndex + 1
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
      }, 1500)
    },
    getRandNumber() {
      if (this.ballPool.length <= 0) {
        return 0
      }

      const max = this.ballPool.length
      const index = Math.floor(Math.random() * max)
      const result = this.ballPool[index]
      this.drewBallPool.push(this.ballPool[index])
      this.ballPool.splice(index, 1)

      return result
    },
    saveData() {
      this.store.set('cardsPerDraw', this.cardsPerDraw)
      this.store.set('ballPoolMin', this.ballPoolMin)
      this.store.set('ballPoolMax', this.ballPoolMax)
      this.store.set('totalBallPool', this.totalBallPool)
      this.store.set('ballPool', this.ballPool)
      this.store.set('drewBallBool', this.drewBallPool)
      this.store.set('results', this.results)
    },
    settingsUpdated(info) {
      if (info.event == 'ballPool') {
        this.ballPoolMin = info.data.min
        this.ballPoolMax = info.data.max
        this.resetBallPool()
      }

      if (info.event == 'cardsPerDraw') {
        this.cardList = []
        this.cardsPerDraw = info.data.count

        this.resetBallPool()
        this.drawCard()
        this.saveData()
      }

      if (info.event == 'resetConfigFile') {
        this.cardsPerDraw = 11
        this.ballPoolMin = 1
        this.ballPoolMax = 110
        this.ballPool = []
        this.drewBallPool = []
        this.results = []

        this.cardList = []

        this.resetBallPool()
        this.drawCard()
        this.saveData()

        this.isSettingsShow = false
        this.isOpenShow = true
      }
    }
  }
}
</script>

<style type="scss" scoped>
.loading-page {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background: rgb(0, 0, 0);

  z-index: 100;
  transition: transform 0.8s;
}

.draw-info,
.key-info {
  position: fixed;
  bottom: 20px;
  left: 50%;
  text-align: center;
  width: 330px;
  margin-left: -165px;
  color: white;
  font-size: 30px;
}

.draw-info {
  z-index: 3;
}
.key-info {
  z-index: 4;
}

.settings {
  z-index: 3;
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

.round {
  display: inline-block;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.6em;
  margin: 2px;
  opacity: 0.6;
}

.round:hover {
  opacity: 0.8;
}

.round:active {
  opacity: 0.5;
}

.v-bg {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgb(0, 0, 0);
}

.v-loop {
  z-index: 0;
}

.v-open {
  z-index: 4;
}
</style>
