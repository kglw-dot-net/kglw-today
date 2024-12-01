// import type {ParamMatcher} from '@sveltejs/kit'

const REGEX_MONTH_DAY = /^([a-z]+)-([1-9]\d?)$/

export function match(param:string):boolean {
  return REGEX_MONTH_DAY.test(param)
}
