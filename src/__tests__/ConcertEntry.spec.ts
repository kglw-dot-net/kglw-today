import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConcertEntry from '../components/ConcertEntry.vue'
import type { ConcertEntry as ConcertEntryType } from '../components/ConcertEntry.vue'

const baseEntry: ConcertEntryType = {
  sortKey: 2019.1,
  entryType: 'concert-kglw',
  id: '2019-concert-123',
  artist: 'King Gizzard & the Lizard Wizard',
  showYear: 2019,
  showOrder: 1,
  permalink: 'king-gizzard-the-lizard-wizard-2019-04-09',
  venuename: 'Regent Theater',
  city: 'Los Angeles',
  country: 'US',
  notes: null,
}

describe('ConcertEntry', () => {
  describe('setlistUrl', () => {
    it('includes the permalink in the URL', () => {
      const wrapper = mount(ConcertEntry, {
        props: { entry: baseEntry, dayLabelShort: 'Apr 9', month: 4, day: 9 },
      })
      const link = wrapper.find('a')
      expect(link.attributes('href')).toContain('king-gizzard-the-lizard-wizard-2019-04-09')
    })

    it('zero-pads single-digit month and day in the campaign param', () => {
      const wrapper = mount(ConcertEntry, {
        props: { entry: baseEntry, dayLabelShort: 'Apr 9', month: 4, day: 9 },
      })
      const href = wrapper.find('a').attributes('href') ?? ''
      expect(href).toContain('campaign=04-09')
    })

    it('does not pad double-digit month and day', () => {
      const wrapper = mount(ConcertEntry, {
        props: { entry: { ...baseEntry, permalink: 'slug-2019-11-22' }, dayLabelShort: 'Nov 22', month: 11, day: 22 },
      })
      const href = wrapper.find('a').attributes('href') ?? ''
      expect(href).toContain('campaign=11-22')
    })

    it('includes the kglw.today src param', () => {
      const wrapper = mount(ConcertEntry, {
        props: { entry: baseEntry, dayLabelShort: 'Apr 9', month: 4, day: 9 },
      })
      const href = wrapper.find('a').attributes('href') ?? ''
      expect(href).toContain('src=kglw.today')
    })
  })

  describe('first show of the day', () => {
    it('shows city and country', () => {
      const wrapper = mount(ConcertEntry, {
        props: { entry: baseEntry, dayLabelShort: 'Apr 9', month: 4, day: 9 },
      })
      expect(wrapper.text()).toContain('Los Angeles')
      expect(wrapper.text()).toContain('US')
    })

    it('does not show a show-number label', () => {
      const wrapper = mount(ConcertEntry, {
        props: { entry: baseEntry, dayLabelShort: 'Apr 9', month: 4, day: 9 },
      })
      expect(wrapper.text()).not.toContain('[show')
    })
  })

  describe('second (or later) show of the day', () => {
    it('shows a show-number label instead of city/country', () => {
      const wrapper = mount(ConcertEntry, {
        props: {
          entry: { ...baseEntry, showOrder: 2 },
          dayLabelShort: 'Apr 9',
          month: 4,
          day: 9,
        },
      })
      expect(wrapper.text()).toContain('[show 2]')
      expect(wrapper.text()).not.toContain('Los Angeles')
    })
  })

  describe('notes', () => {
    it('renders the note emoji when notes are present', () => {
      const wrapper = mount(ConcertEntry, {
        props: {
          entry: { ...baseEntry, notes: 'Surprise set' },
          dayLabelShort: 'Apr 9',
          month: 4,
          day: 9,
        },
      })
      expect(wrapper.text()).toContain('📝')
    })

    it('does not render the note emoji when notes are null', () => {
      const wrapper = mount(ConcertEntry, {
        props: { entry: baseEntry, dayLabelShort: 'Apr 9', month: 4, day: 9 },
      })
      expect(wrapper.text()).not.toContain('📝')
    })
  })
})
