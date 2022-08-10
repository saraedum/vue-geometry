<!--

  A container that provides coordinate system transformations that reflect when
  content is dragged around or zoomed.

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
  <pan-zoom @zoom="zoom" @drag="drag">
    <slot :viewport="viewport"/>
  </pan-zoom>
</template>
<script setup lang="ts">
import { readonly, ref } from "vue";
import type Flatten from "@flatten-js/core";
import PanZoom from "@/components/PanZoom.vue";
import { default as ViewportGeometry } from "@/geometry/Viewport";

const viewport = ref(new ViewportGeometry());

function zoom(factor: number, center: Flatten.Point) {
  viewport.value.zoom(factor, center);
}

function drag(delta: Flatten.Vector) {
  viewport.value.drag(delta);
}
</script>
