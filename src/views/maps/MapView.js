import React from 'react';
import ReactMapboxGl, { Layer, Feature, Popup } from "react-mapbox-gl";
import assign from 'object-assign';
import Immutable from 'immutable';

import Pane from '../../components/base/Pane';
import MapGateways from "./MapGateways";

class MapView extends React.Component {
  constructor() {
    super();
    const colorStyle = {
      top: "-15px",
      left: "-45px",
      height: "100vh",
      width: "100vw",
    }
    this.state = {
      center: [13.3866103, 52.5170092],
      colorStyle: colorStyle
    };

  }

  updateLayer() {

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
          <MapGateways/>
          <Popup coordinates={[13.3866103, 52.5170092]}
            offset={{
                'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
              }}>
            <p>hello</p>
          </Popup>
        </ReactMapboxGl>
      );
  }
}

export default MapView;
