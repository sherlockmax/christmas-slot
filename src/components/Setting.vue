<template lang="pug">
  .settings-page.bg-dark
      .container.p-0
        b-card(no-body)
          b-tabs(card style="font-size: 1.5em" active-nav-item-class="text-warning")
            b-tab(title='Ball Pool' default)
              .row.p-0(style="overflow-y: scroll;")
                .col.p-1
                  b-input-group(prepend='Min')
                    b-input.text-center(type="number" v-model.number="ballMin")
                .col.p-1
                  b-input-group(prepend='Max')
                    b-input.text-center(type="number" v-model.number="ballMax")
                .col-1.p-1
                  b-button(block variant='outline-warning' @click="generate()") Generate
              .row(style="height: 506px; overflow-y: scroll;")
                .col-1.p-1(v-for="(b, i) in ballPoolMin, ballPoolMax")
                  b-button(v-if="!isDrew(b)" block variant='outline-light') {{ b }}
                  b-button.text-dark(v-if="isDrew(b)" block variant='warning') {{ b }}
            b-tab(title='Results' default)
              .row.p-0
                .col(style="height: 540px; overflow-y: scroll;")
                  .row(v-for="(list, i) in results")
                    .col-1.p-1.text-center {{ i+1 }}
                    .col-1.p-1(v-for="b in list")
                      b-button(block variant='outline-warning') {{ b }}
            b-tab(title='Hotkey')
              .row
                .col
                  b-list-group.w-100
                    b-list-group-item.d-flex.justify-content-between.align-items-center
                      | Draw & Turn over the cards [space]
                      b-badge(variant='warning' pill class="text-dark") ␣
                    b-list-group-item.d-flex.justify-content-between.align-items-center
                      | Cover the card
                      b-badge(variant='warning' pill class="text-dark") Q
                    b-list-group-item.d-flex.justify-content-between.align-items-center
                      | Enable/Disable fullscreen
                      b-badge(variant='warning' pill class="text-dark") W
                    b-list-group-item.d-flex.justify-content-between.align-items-center
                      | Enable/Disable opening page
                      b-badge(variant='warning' pill class="text-dark") E
                    b-list-group-item.d-flex.justify-content-between.align-items-center
                      | Wash card
                      b-badge(variant='warning' pill class="text-dark") R
                    b-list-group-item.d-flex.justify-content-between.align-items-center
                      | Reset ball pool
                      b-badge(variant='warning' pill class="text-dark") T
                    b-list-group-item.d-flex.justify-content-between.align-items-center
                      | Open/Close settings
                      b-badge(variant='warning' pill class="text-dark") S
            b-tab(title='Information')
              .row
                .col
                  b-list-group.w-100
                    b-list-group-item.d-flex.justify-content-between.align-items-center
                      span How many cards per draw
                      b-dropdown(:text="selfCardsPerDraw.toString()" right variant="warning")
                        b-dropdown-item-button(v-for="n in cardsPerDrawList" :key="`item_` + n" :active="selfCardsPerDraw == n" @click="chooseCardsPerDraw(n)") {{ n }}
                    b-list-group-item.d-flex.justify-content-between.align-items-center
                      span Config file path
                      span.text-muted {{ filePath }}
                    b-list-group-item.d-flex.justify-content-between.align-items-center
                      span Reset all data
                      b-button(variant='outline-danger' @click="resetConfigFile()") Reset
</template>

<script>
export default {
  // props: ['cardsPerDraw', 'ballPoolMin', 'ballPoolMax', 'results', 'drewBallPool', 'filePath'],
  props: {
    cardsPerDraw: {
      type: Number,
      default: 0
    },
    ballPoolMin: {
      type: Number,
      default: 0
    },
    ballPoolMax: {
      type: Number,
      default: 0
    },
    results: {
      type: Array,
      default: () => {
        return []
      }
    },
    drewBallPool: {
      type: Array,
      default: () => {
        return []
      }
    },
    filePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ballMin: 1,
      ballMax: 110,
      selfCardsPerDraw: '11',
      cardsPerDrawList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    }
  },
  mounted() {
    this.ballMin = this.ballPoolMin
    this.ballMax = this.ballPoolMax
    this.selfCardsPerDraw = this.cardsPerDraw
  },
  methods: {
    generate() {
      this.$emit('updated', { event: 'ballPool', data: { min: this.ballMin, max: this.ballMax } })
    },
    isDrew(ball) {
      console.log(this.lodash.includes(this.drewBallPool, ball))
      return this.lodash.includes(this.drewBallPool, ball)
    },
    chooseCardsPerDraw(count) {
      this.selfCardsPerDraw = count
      this.$emit('updated', { event: 'cardsPerDraw', data: { count: this.selfCardsPerDraw } })
    },
    resetConfigFile() {
      this.$emit('updated', { event: 'resetConfigFile', data: {} })
    }
  }
}
</script>

<style scoped>
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
</style>
