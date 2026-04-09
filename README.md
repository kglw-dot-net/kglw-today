# [KGLW.today] — brought to you by **[KGLW.net]**!

This site uses VueJS to generate static pages which are hosted on GitHub Pages, and uses Cypress for integration testing.


## Routes


### Home page ([`/`][KGLW.today])

Single page, shows a table of months with a link for every day in every month.


### Now page ([`/now`])

Single page, links to the current Month-Day page (based on the browser's date / timezone).


### Month-Day pages (e.g. [`/jan-7`])

Multiple pages, one for every day in every month (including [Leap Day]).

URL pattern: `/mmm-D`
* `mmm` — lowercase/slugified English abbreviation for month name
* `D` — number of the day in the month (no zero-padding)

Links to any concerts, album releases, etc which happened on the given day in previous years.


### Year-Month-Day redirects (e.g. `/2023-06-07`, `/2023-06-08@2`)

Multiple redirects, one for every concert recorded on KGLW.net.

URL pattern: `/YYYY-MM-DD`
* `YYYY` — four-digit year
* `MM` — two-digit (zero-padded) month
* `DD` — two-digit (zero-padded) day

URL pattern: `/YYYY-MM-DD@#`
* `#` — [optional] one-digit, to differentiate multiple shows on the same date

Redirects to the appropriate concert URL on the KGLW.net site.


---

[`/jan-7`]: https://kglw.today/jan-7?source=github&campagin=readme
[`/now`]: https://kglw.today/now?source=github&campagin=readme
[KGLW.net]: https://kglw.net?source=kglw.today&campaign=github-readme
[KGLW.today]: https://kglw.today?source=github&campaign=readme
[Leay Day]: https://kglw.today/feb-29?source=github&campagin=readme
