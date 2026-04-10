import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FooterBar from '../components/FooterBar.vue'

const mountOptions = {
  global: {
    stubs: {
      RouterLink: { template: '<a><slot /></a>' },
    },
  },
}

describe('FooterBar', () => {
  it('renders a footer element', () => {
    const wrapper = mount(FooterBar, mountOptions)
    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('links back to calendar', () => {
    const wrapper = mount(FooterBar, mountOptions)
    expect(wrapper.text()).toContain('Back to Calendar')
  })

  it('credits KGLW.net', () => {
    const wrapper = mount(FooterBar, mountOptions)
    expect(wrapper.text()).toContain('KGLW.net')
  })
})
