import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomePage from '../pages/HomePage.vue'

describe('HomePage', () => {
  it('renders without errors', () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: { MonthDayPage: true },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('passes a non-empty monthday prop to MonthDayPage after mount', async () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: { MonthDayPage: true },
      },
    })
    // onMounted fires synchronously in the jsdom test environment, but we flush
    // any pending microtasks to be safe.
    await wrapper.vm.$nextTick()
    const page = wrapper.findComponent({ name: 'MonthDayPage' })
    const monthday = page.attributes('monthday') ?? ''
    // Should look like a slug e.g. "apr-9"
    expect(monthday).toMatch(/^[a-z]{3}-\d{1,2}$/)
  })
})
