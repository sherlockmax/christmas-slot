<template lang="pug">
  .card(:class="{ 'opened': isOpened }" :style="customStyle")
    .card-content
        .card-back
          img(src='@/assets/img/card_back.png')
          .fx(ref="cardBackFX" v-if="!isOpened" :style="[backgroundSize]")
        .card-front
          img(src='@/assets/img/card_front.png')
          .fx(ref="cardFrontFX" v-if="isOpened" :style="[backgroundSize]")
          .card-text.d-flex.justify-content-center.align-items-center(:style="numberStyle") {{ number }}
</template>

<script>
export default {
  props: {
    customStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    number: {
      type: Number,
      default: 0
    },
    isOpened: Boolean,
    numberStyle: {
      type: Object,
      default: () => {
        return { 'font-size': '70px' }
      }
    },
    cardSize: {
      type: Object,
      default: () => {
        return { width: 100, height: 150 }
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    backgroundSize() {
      return {
        '--size': this.cardSize.width * 30 * -1 + 'px',
        backgroundSize: this.cardSize.width * 30 + 'px ' + this.cardSize.height + 'px'
      }
    }
  }
}
</script>

<style scoped>
.card {
  position: fixed;
  background-color: transparent;
  perspective: 1000px;
  animation: float 5s infinite;

  transition: transform 0.8s;
}

.card-front,
.card-back,
.card-front img,
.card-back img,
.card-text {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;

  font-size: 110px;
  color: #eea65b;
}

.card-front .fx {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;

  background: url('../assets/img/fx_front.png');
  animation: fx 6s steps(30) infinite;
}

.card-back .fx {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;

  background: url('../assets/img/fx_back.png');
  animation: fx 6s steps(30) infinite;
}

.card-content {
  width: 100%;
  height: 100%;
  transition: transform 1.5s;
  transform-style: preserve-3d;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-front {
  transform: rotateY(180deg);
}

.card.opened .card-content {
  transform: rotateY(180deg);
}

@keyframes float {
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

@keyframes fx {
  0% {
    background-position: 0px;
  }
  15%,
  100% {
    background-position: var(--size);
  }
}
</style>
