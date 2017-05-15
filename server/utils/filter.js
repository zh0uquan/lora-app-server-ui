import moment from 'moment'
import processNode from './processNode.js'

const valuesToArray = (iterator) => Array.from(iterator.values())

const filter = (nodes) => {
  let hashtable = new Map()
  for (let node of nodes) {
    node = processNode(node)
    hashtable.set(
      JSON.stringify(node.coordinates), (hashtable.get(JSON.stringify(node.coordinates)) || []).concat(node))
  }

  // get the lastest node infomation(rssi etc) of coordations
  // this should be optimazed by the gateway and device
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
