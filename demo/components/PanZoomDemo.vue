<!--
 |  This file is part of vue-geometry.
 |
 |        Copyright (c) 2021-2022 Julian Rüth
 | 
 |  vue-geometry is free software: you can redistribute it and/or modify
 |  it under the terms of the GNU General Public License as published by
 |  the Free Software Foundation, either version 3 of the License, or
 |  (at your option) any later version.
 |
 |  vue-geometry is distributed in the hope that it will be useful,
 |  but WITHOUT ANY WARRANTY; without even the implied warranty of
 |  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 |  GNU General Public License for more details.
 |
 |  You should have received a copy of the GNU General Public License
 |  along with vue-geometry. If not, see <https://www.gnu.org/licenses/>.
 -->
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
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  font-family: monospace;
}
</style>
