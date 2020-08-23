const cloneDeepWith = require('lodash.clonedeepwith')

function clone(object) {
  return cloneDeepWith(object, (value) => {
    if (typeof value === 'string' && value.startsWith('data:image/')) {
      return value.slice(0, 40)
    }
  })
}

module.exports = (toClone) => {
  if (typeof toClone === 'string') {
    var json = JSON.parse(toClone)
    const cloned = clone(json)
    return JSON.stringify(cloned)
  } else {
    return clone(toClone)
  }
}
