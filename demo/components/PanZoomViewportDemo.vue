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
  <pan-zoom-viewport v-slot="{ viewport }">
    <svg-root :viewport="viewport"/>
  </pan-zoom-viewport>
</template>
<script setup lang="ts">
import PanZoomViewport from "@/components/PanZoomViewport.vue";
import SvgRoot from "./SvgRoot.vue";
</script>
