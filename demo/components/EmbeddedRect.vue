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
  <rect :x="box.xmin" :y="box.ymax" :width="box.width" :height="box.height" fill="cornflowerblue" />
</template>
<script setup lang="ts">
import type Flatten from "@flatten-js/core";
import { computed } from "vue";
import Viewport from "@/geometry/Viewport";

const { idealCoordinateSystem, clientCoordinateSystem } = Viewport.use();

const box = computed(() => {
  return clientCoordinateSystem.embed(idealCoordinateSystem.box(100, -100, 64, 32)) as Flatten.Box;
});

</script>
