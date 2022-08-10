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
  <svg width="512" height="384">
    <embedded-rect />
  </svg>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
import type { DeepReadonly } from "vue";
import EmbeddedRect from "./EmbeddedRect.vue";
import Viewport from "@/geometry/Viewport";

interface Props {
  viewport: DeepReadonly<Viewport>;
}
const props = defineProps<Props>();
Viewport.use(props.viewport);

</script>
<style scoped>
svg {
  border: 1px solid lightgrey;
}
</style>
