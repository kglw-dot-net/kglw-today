import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MiscEntry from '../components/MiscEntry.vue'
import type { MiscEntry as MiscEntryType } from '../components/MiscEntry.vue'

const baseEntry: MiscEntryType = {
  sortKey: 2015,
  entryType: 'misc',
  id: '2015-misc-0',
  year: 2015,
  markdownContent: 'Something happened',
}

describe('MiscEntry', () => {
  it('renders the year and day label', () => {
    const wrapper = mount(MiscEntry, {
      props: { entry: baseEntry, dayLabelShort: 'Apr 9' },
    })
    expect(wrapper.text()).toContain('2015')
    expect(wrapper.text()).toContain('Apr 9')
  })

  it('renders plain markdown text as text', () => {
    const wrapper = mount(MiscEntry, {
      props: { entry: baseEntry, dayLabelShort: 'Apr 9' },
    })
    expect(wrapper.text()).toContain('Something happened')
  })

  it('renders markdown links as anchor elements', () => {
    const wrapper = mount(MiscEntry, {
      props: {
        entry: { ...baseEntry, markdownContent: 'Check [this out](https://example.com)' },
        dayLabelShort: 'Apr 9',
      },
    })
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com')
    expect(link.text()).toBe('this out')
  })

  it('renders markdown bold as <strong>', () => {
    const wrapper = mount(MiscEntry, {
      props: {
        entry: { ...baseEntry, markdownContent: 'a **bold** word' },
        dayLabelShort: 'Apr 9',
      },
    })
    expect(wrapper.find('strong').exists()).toBe(true)
    expect(wrapper.find('strong').text()).toBe('bold')
  })
})
