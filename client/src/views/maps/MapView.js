import React from 'react';
import ReactMapboxGl from "react-mapbox-gl";
import GatewayLayer from "./GatewayLayer";
import NodeLayer from "./NodeLayer";

class MapView extends React.Component {
  constructor() {
    super();
    const colorStyle = {
      margin: '-15px',
      height: "100vh",
      width: "100vw",
    }
    this.state = {
      center: [13.3866103, 52.5170092],
      colorStyle: colorStyle
    };

  }


  render () {
    var {colorStyle, center} = this.state;
    return (
      <ReactMapboxGl
          style="mapbox://styles/mapbox/light-v9"
          accessToken="pk.eyJ1IjoiemhvdXF1YW4iLCJhIjoiY2oyNHN1ZWVqMDAzbTJxcWsxa3IzaWtjbCJ9.qDS9tt6xECnllXR2fCJnWQ"
          containerStyle={colorStyle}
          center={center}
          >
          <NodeLayer/>
          <GatewayLayer/>
        </ReactMapboxGl>
      );
  }
}

export default MapView;
