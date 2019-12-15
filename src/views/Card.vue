<template lang="pug">
  .card(:class="{ 'opened': isOpened }" :style="customStyle")
    .card-content
        .card-back
          img(src='@/assets/img/card_back.png')
        .card-front
          img(src='@/assets/img/card_front.png')
          .card-text.d-flex.justify-content-center.align-items-center(:style="numberStyle") {{ number }}
</template>

<script>
module.exports = {
  props: ['customStyle', 'number', 'isOpened', 'numberStyle'],
  data() {
    return {}
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

.card-content {
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
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
</style>
