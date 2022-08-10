<template>
  <pan-zoom @zoom="zoom" @drag="drag" @start="start" @end="end">
    <div class="container">
      {{ event }}
    </div>
  </pan-zoom>
</template>
<script setup lang="ts">
import { ref } from "vue";
import PanZoom from "@/components/PanZoom.vue";
import type Flatten from "@flatten-js/core";

const event = ref("click me!");

function zoom(zoom: number, center: Flatten.Point) {
  event.value = `zoom by ${zoom} with center ${JSON.stringify(center.toJSON())}`;
}

function drag(delta: Flatten.Vector) {
  event.value = `drag by ${JSON.stringify(delta.toJSON())}`
}

function start() {
  event.value = "drag me!";
}

function end() {
  event.value = "click me!";
}
</script>
<style scoped>
.container {
  border: 1px solid lightgrey;
  width: 512px;
  height: 384px;
  padding: 1em;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  font-family: monospace;
}
</style>
