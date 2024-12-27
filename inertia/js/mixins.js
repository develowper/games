import { usePage } from '@inertiajs/vue3'
import mitt from 'mitt'

export const emitter = mitt()

export function f2e(num) {
  return window.f2e(num)
}
export function getDuration(sec) {
  if (sec == null || sec == 0) return '0'
  var sec_num = parseInt(sec, 10) // don't forget the second param
  var hours = Math.floor(sec_num / 3600)
  var minutes = Math.floor((sec_num - hours * 3600) / 60)
  var seconds = sec_num - hours * 3600 - minutes * 60

  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return hours + ':' + minutes + ':' + seconds
}

export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace)
}

export function scrollTo(el) {
  window.scroll({
    top: document.querySelector(el) ? document.querySelector(el).offsetTop : 0,

    behavior: 'smooth',
  })
}

export function toggleArray(item, array = []) {
  let i = null
  for (let idx in array) {
    if (array[idx] == item) {
      i = idx
      break
    }
  }
  if (i != null) array.splice(i, 1)
  else array.push(item)

  return array
}

export function mySum(array) {
  array = array || []
  return array.reduce((partialSum, a) => partialSum + a, 0)
}
export function toRelativeTime(previous) {
  let current = Date.now()
  var msPerMinute = 60 * 1000
  var msPerHour = msPerMinute * 60
  var msPerDay = msPerHour * 24
  var msPerMonth = msPerDay * 30
  var msPerYear = msPerDay * 365
  previous = new Date(previous)
  var elapsed = current - previous

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ` ${this.__('second')} ${this.__('ago')}`
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ` ${this.__('minute')} ${this.__('ago')}`
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ` ${this.__('hour')} ${this.__('ago')}`
  } else if (elapsed < msPerMonth) {
    return '' + Math.round(elapsed / msPerDay) + ` ${this.__('day')} ${this.__('ago')}`
  } else if (elapsed < msPerYear) {
    return '' + Math.round(elapsed / msPerMonth) + ` ${this.__('month')} ${this.__('ago')}`
  } else {
    return '' + Math.round(elapsed / msPerYear) + ` ${this.__('year')} ${this.__('ago')}`
  }
}

export function dir() {
  let $lang = usePage().props.language
  if ($lang === 'en') return 'ltr'
  else return 'rtl'
}
export function __(key, replace = {}) {
  let $lang = usePage().props.language
  var translation = $lang[key] ? $lang[key] : key

  Object.keys(replace).forEach(function (key) {
    translation = translation.replace(`{${key}}`, replace[key])
  })

  return translation
}
export function isAdmin() {
  return !!usePage().props.auth.isAdmin
}
export function hasAccess(role) {
  const auth = usePage().props.auth
  return auth.accesses && (auth.accesses == 'all' || auth.accesses.indexOf(role) >= 0)
}
export function toShamsi(day = null, time = false) {
  var t = new Date().getTime()
  if (!day) return ''
  else var today = day == 'now' ? new Date() : new Date(day)
  let options = {
    hour12: false,

    year: 'numeric',
    month: '2-digit',
    day: '2-digit',

    calendar: 'persian',
  }
  if (time)
    options = {
      ...options,
      hour: '2-digit',
      minute: '2-digit',
    }
  //                var dd = String(today.getDate()).padStart(2, '0');
  //                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  //                var yyyy = today.getFullYear();
  //                return yyyy + '/' + mm + '/' + dd;

  return f2e(today.toLocaleDateString('fa-IR', options))
}
export function showToast(type, message) {
  emitter.emit('showToast', { type, message })
}
export function showAlert(type, message) {
  emitter.emit('showAlert', { type, message })
}
export function showDialog(type, message, button, action, items = null) {
  emitter.emit('showDialog', { type, message, button, action, items })
}
export function isLoading(loading) {
  emitter.emit('loading', loading)
}
export function asPrice(price) {
  if (!price) return 0
  // return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}
export function getAgency(id) {
  if (id == null || usePage().props.agency_types == null) return ''
  for (const el of usePage().props.agency_types) if (el.id == id) return this.__(el.name)
  return ''
}
export function cropText(str, len, trailing = '...') {
  return str && str.length >= len ? `${str.substring(0, len)}${trailing}` : str
}
export async function initTableDropdowns() {
  if (typeof window === 'undefined') return
  const { Dropdown } = await import('tw-elements')

  const dropdownElementList = [].slice.call(
    document.querySelectorAll('td [data-te-dropdown-toggle-ref]')
  )
  window.dropdownList = dropdownElementList.map((dropdownToggleEl) => {
    let d = new Dropdown(dropdownToggleEl)
    dropdownToggleEl.addEventListener('click', function (event) {
      d.toggle()
    })
    return d
  })
}
export function getUrlParams(url = null) {
  const queryString = url ? new URL(url).search : window.location.search
  const urlParams = new URLSearchParams(queryString)
  const params = Object.fromEntries(urlParams.entries())
  return params
}
export function log(str) {
  console.log(str)
}
export function setUrlParams(params = {}, url = window.location.href) {
  // Parse the provided URL or use the current window location
  const urlObj = new URL(url)

  for (let i = 0; i < Object.entries(params).length; i++) {
    const [key, value] = Object.entries(params)[i]
    if (value === null || value === undefined) {
      urlObj.searchParams.delete(key)
    } else {
      urlObj.searchParams.set(key, value)
    }
  }
  if (Object.entries(params).length == 0) {
    urlObj.search = ''
  }
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', urlObj.toString())
    // router.visit(`${window.location.pathname}?${urlObj.searchParams.toString()}`, {
    //   preserveState: true,
    //   preserveScroll: true,
    //   replace: true,
    //   only: [],
    // })
  }

  return urlObj.toString()
}
export function getError(error) {
  if (error.response) {
    if (error.response.status == 419)
      // location.reload();
      null
    if (error.response.data && error.response.data.errors)
      return myMap(error.response.data.errors, (item) => item.message).join('<br/>')
    if (error.response.data && error.response.data.message)
      if (error.response.data.message == 'Unauthenticated.')
        return this.__('first_login_or_register')
    return error.response.data.message
  } else if (error.request) {
    return error.request
  } else {
    return error.message
  }
}
export function getErrors(error) {
  if (error.response) {
    if (error.response.status == 419)
      // location.reload();
      null
    if (error.response.data && error.response.data.errors)
      return error.response.data.errors.reduce((acc, item) => {
        acc[item.field] = item.message // Set key as field, value as message
        return acc
      }, {})
    if (error.response.data && error.response.data.message)
      if (error.response.data.message == 'Unauthenticated.')
        return this.__('first_login_or_register')
    return error.response.data.message
  } else if (error.request) {
    return error.request
  } else {
    return error.message
  }
}
export function myMap(arr, callbackFn) {
  var tmp = []
  for (var i = 0; i < arr.length; i++) {
    tmp.push(callbackFn(arr[i]))
  }
  return tmp
}
export function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    // Modern asynchronous clipboard API
    return navigator.clipboard
      .writeText(text)
      .then(() => {
        this.showToast('success', this.__('copy_to_clipboard_successfully'))
        return
      })
      .catch((err) => {
        // console.error('Failed to copy text: ', err);
      })
  }
  var textArea = document.createElement('textarea')
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    var successful = document.execCommand('copy')
    this.showToast('success', this.__('copy_to_clipboard_successfully'))
  } catch (err) {}

  document.body.removeChild(textArea)
}
export function toJson(str) {
  if (typeof str !== 'string') return false
  try {
    const result = JSON.parse(str)
    const type = Object.prototype.toString.call(result)
    return type === '[object Object]' || type === '[object Array]' ? result : false
  } catch (err) {
    return false
  }
}
export function isClient() {
  // console.log('******************')
  // console.log(typeof window !== 'undefined')
  return typeof window !== 'undefined'
}

export function getSocketUrl() {
  return usePage().props.socket_url
}
