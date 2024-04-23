# [KGLW.today] — brought to you by **[KGLW.net]**!


## Routes


### Home page ([`/`][KGLW.today])

Single page, shows a table of months with a link for every day in every month.


### Now page ([`/now`])

Single page, links to the current Month-Day page (based on the browser's date / timezone).


### Month-Day pages (e.g. [`/jan-7`])

Multiple pages, one for every day in every month (including [Leap Day]).

URL pattern: `/mmm-Y`
* `mmm` — lowercase/slugified English abbreviation for month name
* `Y` — number of the day in the month (no zero-padding)

Links to any concerts, album releases, etc which happened on the given day in previous years.


### Year-Month-Day redirects (e.g. `/2023-06-07`)

Multiple redirects, one(`*`) for every concert recorded on KGLW.net.

URL pattern: `/YYYY-MM-DD`
* `YYYY` — four-digit year
* `MM` — two-digit (zero-padded) month
* `DD` — two-digit (zero-padded) day

Redirects to the appropriate concert URL on the KGLW.net site.

*Does __not__ account for [multiple shows on the same day](https://github.com/kglw-dot-net/kglw-today/issues/101).*


## Framework docs

This site is set up using Gatsby:
- [Documentation](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
- [Tutorials](https://www.gatsbyjs.com/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
- [Guides](https://www.gatsbyjs.com/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
- [API Reference](https://www.gatsbyjs.com/docs/api-reference/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
- [Plugin Library](https://www.gatsbyjs.com/plugins?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
- [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)


[`/jan-7`]: https://kglw.today/jan-7?source=github&campagin=readme
[`/now`]: https://kglw.today/now?source=github&campagin=readme
[KGLW.net]: https://kglw.net?source=kglw.today&campaign=github-readme
[KGLW.today]: https://kglw.today?source=github&campaign=readme
[Leay Day]: https://kglw.today/feb-29?source=github&campagin=readme
