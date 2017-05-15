import moment from 'moment'

const precision = (node) => {
  node.coordinates = [node.location.y.toFixed(5), node.location.x.toFixed(5)]
  return node
}

const valuesToArray = (iterator) => Array.from(iterator.values())

const filter = (nodes) => {
  let hashtable = new Map()
  for (let node of nodes) {
    node = precision(node)
    hashtable.set(
      JSON.stringify(node.coordinates), (hashtable.get(JSON.stringify(node.coordinates)) || []).concat(node))
  }

  const now = moment({})
  for (let corrd of hashtable.keys()) {
    let dateDict = new Map()
    for (let node of hashtable.get(corrd)) {
      let diffDay = now.diff(moment(node.time), 'days')
      if ( dateDict.get(diffDay) === undefined ) {
        dateDict.set(diffDay, node)
      } else {
        if (moment(node.time) > moment(dateDict.get(diffDay).time)) {
          dateDict.set(diffDay, node)
        }
      }
    }
    hashtable.set(corrd, valuesToArray(dateDict))
  }

  let res = valuesToArray(hashtable).reduce((arr, curr)=> arr.concat(curr), [])
  return res
}

export default filter;
