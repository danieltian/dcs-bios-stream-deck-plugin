const cloneDeepWith = require('lodash.clonedeepwith')
const settings = require('./mock-settings.json')

const s = cloneDeepWith(settings, (value) => {
  if (typeof value === 'string' && value.startsWith('data:image/')) {
    return value.slice(0, 40)
  }
})

console.log(s)
