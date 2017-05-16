const bufferToStr = (buff) => {
  let arr = new Uint16Array(buff)
  return arr.reduce((curr, next) => curr + ('00' + next.toString(16)).slice(-2), '')
}
const strToArray = (str) => JSON.parse(str.replace(/\(/g, "[").replace(/\)/g, "]"))

const processNode = (node) => {
  if (node.location) {
    if (typeof(node.location) === 'object') {
      node.coordinates = [node.location.y.toFixed(5), node.location.x.toFixed(5)]
      node.gw_mac = bufferToStr(node.gw_mac)
      node.deveui = bufferToStr(node.deveui)
    }
    if (typeof(node.location) === 'string') {
      let [lat, lon] = strToArray(node.location)
      node.coordinates = [lon.toFixed(5), lat.toFixed(5)]
      node.gw_mac = node.gw_mac.substr(-16)
      node.gw_mac = node.node.deveui.substr(-16)
    }
  }

  return node
}

export default processNode;
