# source for [KGLW.today]

Brought to you by **[kglw.net]**!


## Routes


### Home page (`/`)

Single page, shows a table of months with a link for every day in every month.


### Now page (`/now`)

Single page, links to the current Month-Day page (based on the browser's date / timezone).


### Month-Day pages (e.g. `/jan-7`)

Multiple pages, one for every day in every month (including [Leap Day](https://kglw.today/feb-29/)).

URL pattern: `/mmm-YY` (where `mmm` is lowercase/slugified English abbreviation for month name, and `YY` is zero-padded number of the date).

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


[KGLW.today]: https://kglw.today?source=github&campaign=readme
[kglw.net]: https://kglw.net?source=kglw.today&campaign=github-readme
