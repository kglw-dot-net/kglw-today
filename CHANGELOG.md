# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project attempts to adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


<!-- ## [tagname] — date -->
<!-- ### Added -->
<!-- ### Changed -->
<!-- ### Removed -->


## [alpha] — untagged
### Changed
* (ops) updated dependencies
* (ops) tweaked test task names (now `test` is normal Cypress; `test:serve` will start server and then run Cypress) and changed the port for running on CI


## [1.1.1] — 2024-02-03

### Added
* (test) test for `/yyyy-mm-dd` redirect
### Changed
* (feature) set `target` attribute on concert links (to work better with `/now` iframe)
* (feature) link "King Gizzard History" in the title to the `kglw.today` landing page
* (style) adjust background color
* (ops) updated various dependencies
<!-- ### Removed -->


## [1.1.0] — 2024-01-05

### Added
* (feature) route: `/now` to be used [e.g. with iframes](https://github.com/kglw-dot-net/kglw-today/issues/65)
<!-- ### Changed -->
<!-- ### Removed -->


## [1.0.2] — 2024-01-04

### Added
* Changelog!
* (data) additions: birthdays; notes for Bootlegger releases
* (data) new source: `show-notes.json`
* (feature) optional Notes on individual concerts
### Changed
* (style) tweaks
* [core] use v2 of [Songfish API](https://kglw.net/api/docs.php)
<!-- ### Removed -->


## [1.0.1] - 2023-10-22

### Added
* (data) files are JSON stored in the repo; NPM task to update data for recent concerts
  * possible (but not exactly straightforward) for non-coders to fix & create PR using GitHub's UX
* (feature) home page linking to the "current day" (based on the user's browser)
* (feature) integration w/ GoatCounter
* (feature) redirect route pattern `/yyyy-mm-dd` to appropriate Setlist page on Songfish
* (feature) route: "Month-Day" pages for every day in [the Julian calendar](https://en.wikipedia.org/wiki/Julian_calendar) (e.g. `/jul-16`)
* (ops) dependency updates via GitHub
* (ops) push to `main` deploys to production using [GitHub Actions](https://github.com/kglw-dot-net/kglw-today/actions)
* (ops) rudimentary automation for updating concert data (using hook on `build` task)
* (ops) set up [Cypress](https://cypress.io) testing framework & integrate w/ GitHub
* (ops) update dependencies (`gatsby` etc; `sass`; `markdown-it`; debugging stuff)
* (style) design: '80s digital, green and pixelated
### Changed
* (ops) bump NodeJS to [v20.x](https://github.com/kglw-dot-net/kglw-today/commit/7fff025b8a15b79eb)
* (ops) remove boilerplate
<!-- ### Removed -->


## [prerelease "1.0.0"] - 2023-04-23

Initial setup with Gatsby boilerplate.

### Added
* (boilerplate) landing page
* (ops) [specify NodeJS version](https://github.com/kglw-dot-net/kglw-today/commit/e04c6cf4392) (18.15.0)
<!-- ### Changed -->
<!-- ### Removed -->



[alpha]: https://github.com/kglw-dot-net/kglw-today/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/kglw-dot-net/kglw-today/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/kglw-dot-net/kglw-today/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/kglw-dot-net/kglw-today/compare/d4cfcb8b93099e7315e8b44e3d16655a63232a2e...v1.0.2
[1.0.1]: https://github.com/kglw-dot-net/kglw-today/compare/e66ea851d1b0a2...d4cfcb8b93099e7315e8b44e3d16655a63232a2e
[prerelease "1.0.0"]: https://github.com/kglw-dot-net/kglw-today/commit/e66ea851d1b0a2a5378f33d243dc3a27aab0d5d0
