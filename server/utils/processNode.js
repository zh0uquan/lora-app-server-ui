const bufferToStr = (buff) => {
  var arr = new Uint16Array(buff)
  return arr.reduce((curr, next) => curr + ('00' + next.toString(16)).slice(-2), '')
}

const processNode = (node) => {
  node.coordinates = [node.location.y.toFixed(5), node.location.x.toFixed(5)]
  node.gw_mac = bufferToStr(node.gw_mac)
  node.deveui = bufferToStr(node.deveui)
  return node
}

export default processNode;
