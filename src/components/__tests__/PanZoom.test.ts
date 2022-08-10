import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import PanZoom from "../PanZoom.vue";

describe('PanZoom', () => {
  // This does not really test anything. What should we test here?
  it('renders', () => {
    const wrapper = mount(PanZoom, {});
    expect(wrapper.html()).to.contain('class="pan-zoom"');
  })
})
