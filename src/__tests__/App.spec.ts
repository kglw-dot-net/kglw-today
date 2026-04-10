import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders without errors', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: true,
          GoatCounter: true,
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
