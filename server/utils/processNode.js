const bufferToStr = (buff) => {
  let arr = new Uint16Array(buff)
  return arr.reduce((curr, next) => curr + ('00' + next.toString(16)).slice(-2), '')
}

const strToArray = (str) => JSON.parse(str.replace(/\(/g, "[").replace(/\)/g, "]"))

const processNode = (node) => {
  if (node.location !== null) {
    switch(typeof(node.location)) {
      case 'object':
        node.coordinates = [node.location.y.toFixed(4), node.location.x.toFixed(4)]
        node.gw_mac = bufferToStr(node.gw_mac)
        node.deveui = bufferToStr(node.deveui)
        break;
      case 'string':
        let [lat, lon] = strToArray(node.location)
        node.coordinates = [lon.toFixed(4), lat.toFixed(4)]
        node.gw_mac = node.gw_mac.substr(-16)
        node.deveui = node.deveui.substr(-16)
        break;
    }
    return node;
  }
  return null;
}

export default processNode;
