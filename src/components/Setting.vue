<template lang="pug">
  .settings-page.bg-dark
      .container.p-0
        b-card(no-body)
          b-tabs(card style="font-size: 1.5em" active-nav-item-class="text-warning")
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
                          b-button(block variant='outline-info') {{ b }}
            b-tab(title='Hotkey')
              .row.h-100
                .col.h-100.d-flex.justify-content-center.align-items-center
                  b-list-group(class="w-50")
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
            b-tab(title='Config')
              .row.h-100
                .col.h-100.d-flex.justify-content-center.align-items-center
                  b-list-group(class="w-50")
                    b-list-group-item.d-flex.justify-content-between.align-items-center
                      span How many draws
                      span 10
                    b-list-group-item.d-flex.justify-content-between.align-items-center
                      span How many cards per draw
                      span 11
                    b-list-group-item.d-flex.justify-content-between.align-items-center
                      span How many cards per line
                      span 6
</template>

<script>
module.exports = {
  props: ['results', 'ballPool'],
  data() {
    return {}
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
