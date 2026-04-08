import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders the site footer', () => {
    const wrapper = mount(App, {
      global: {
        // Stub router components so this unit test doesn't need a full router instance.
        // RouterLink needs a template with a slot so its text content is still rendered.
        stubs: {
          RouterView: true,
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    })
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.text()).toContain('Back to Calendar')
    expect(wrapper.text()).toContain('KGLW.net')
  })
})
