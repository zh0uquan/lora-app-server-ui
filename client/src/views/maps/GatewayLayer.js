import React, { Component } from 'react';
import { Layer, Feature, Popup } from "react-mapbox-gl";

import GatewayStore from "../../stores/GatewayStore";

class GatewayLayer extends Component {

  constructor() {
    super();
    this.state = {
      gateways: [],
      currentPopup: null,
    };
  }

  componentDidMount() {
    this.updateMapGateway(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateMapGateway(nextProps);
  }

  updateMapGateway(props) {
    GatewayStore.listAll((gateways) => {
      this.setState({
        gateways: gateways,
      });
    });
  }

  _onClickMarker(gw) {
    if (this.state.currentPopup) {
      this.setState({
        currentPopup: null
      })
    } else{
      this.setState({
        currentPopup: {
          coordinates: [gw.longitude, gw.latitude],
          name: gw.name,
          description: gw.description,
          popupShowLabel: !this.state.popupShowLabel
        }
      });
    }
  }

  _onClickPopup() {
    this.setState({
      currentPopup: null
    })
  }

  render() {
    const { gateways, currentPopup } = this.state

    const GatewayFeatures = gateways.map((gw, i) =>
      <Feature
        key={gw.mac}
        coordinates={[gw.longitude, gw.latitude]}
        onClick={this._onClickMarker.bind(this, gw)}
      />
    );
    return (
        <div>
          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}>
            {GatewayFeatures}
          </Layer>
          {currentPopup &&
            <Popup
              style={{display: currentPopup.popupShowLabel? "true": "none" }}
              coordinates={currentPopup.coordinates}
              anchor={"bottom"}
              offset={10}
              onClick={this._onClickPopup.bind(this)}>
              <p className="text-popup"><strong>{currentPopup.name}</strong></p>
              <p className="text-popup">{currentPopup.description}</p>
              <p className="text-popup">Status: <i className="fa fa-circle" aria-hidden="true" style={{color:"#76FF03"}}></i></p>
            </Popup>
          }
        </div>
    );
  }
}


export default GatewayLayer;
