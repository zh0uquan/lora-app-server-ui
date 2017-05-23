const earthRadius = 6371000;

export const distance = (corrd1, coord2) => {
  let [lon1, lat1 ] = corrd1
  let [lon2, lat2 ] = coord2

  let latDelta = (lat2 - lat1) * Math.PI / 180
  let lonDelta = (lon2 - lon1) * Math.PI / 180

  let lat1Rad = lat1 * Math.PI / 180
  let lat2Rad = lat2 * Math.PI / 180

  let a = Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
          Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2) *
          Math.cos(lat1Rad) * Math.cos(lat2Rad)

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.floor(earthRadius * c)
}
