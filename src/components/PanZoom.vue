<!--

  A container that emits events when content is dragged around or zoomed.

-->
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
  <div class="pan-zoom" ref="container" @mousedown="pan = true" @mouseup="pan = false" @mouseout="pan = false" :class="{ pan }">
    <slot/>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import Flatten from "@flatten-js/core";
import panzoom from "@thesoulfresh/pan-zoom";

const emit = defineEmits<{
  (e: 'zoom', zoom: number, center: Flatten.Point): void,
  (e: 'drag', delta: Flatten.Vector): void,
  (e: 'start'): void,
  (e: 'end'): void,
}>()

const pan = ref(false);

let unpanzoom: null | (() => void) = null;

const container = ref();

onMounted(() => {
  if (navigator.userAgent.includes("jsdom"))
    // pan-zoom does not work in jsdom. Why?
    return;

  unpanzoom = panzoom(container.value, (e: any) => {
    // We either zoom or pan; mixing this is probably confusing.
    if (e.dz !== 0) {
      emit("zoom", Math.exp(-e.dz/256), new Flatten.Point(e.x, e.y));
      return;
    }
    
    emit("drag", new Flatten.Vector(-e.dx, -e.dy));
  }, {
    onStart() {
      emit("start");
    },
    onEnd() {
      emit("end");
    }
  });
});

onBeforeUnmount(() => {
  unpanzoom!();
});

</script>
<style scoped>
.pan-zoom {
  display: inline-block;
  /* So the div is no higher than its contents. */
  cursor: grab;
}
.pan-zoom.pan {
  cursor: grabbing;  
}
</style>
