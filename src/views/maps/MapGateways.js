import React, { Component } from 'react';
import { Layer, Feature, Popup } from "react-mapbox-gl";

import GatewayStore from "../../stores/GatewayStore";

const GatewayFeature = (props) =>
  <Feature coordinates={props.coordinates} properties={props.properties}/>
const fakedata = [{
  "mac":"0000000000000000","name":"CoreGateway","description":"Dev Fake GateWay","latitude":52.539241,"longitude":13.3949609,"altitude":0,"createdAt":"2017-05-01T18:21:44.147194Z","updatedAt":"2017-05-01T18:21:44.147194Z","firstSeenAt":"","lastSeenAt":""},{"mac":"0000000000000001","name":"FakeGateWay","description":"Fake gate way","latitude":52.49239701180824,"longitude":13.329870700836182,"altitude":0,"createdAt":"2017-05-01T19:01:57.196158Z","updatedAt":"2017-05-01T19:01:57.196158Z","firstSeenAt":"","lastSeenAt":""},{"mac":"0000000000000002","name":"XuGateway","description":"xu cao","latitude":52.50640031375411,"longitude":13.450012207031252,"altitude":0,"createdAt":"2017-05-01T19:02:35.683761Z","updatedAt":"2017-05-01T19:02:35.683761Z","firstSeenAt":"","lastSeenAt":""}]

class MapGateways extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
      gateways: [],
    };

    this.updateMapGateway = this.updateMapGateway.bind(this);
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
    // setInterval(() => {
    //   this.setState({gateways: fakedata});
    // }, 5000);
  }

  render() {
    var GatewayFeatures = this.state.gateways.map((gw, i) => (
              <GatewayFeature key={gw.mac}
                              coordinates={[gw.longitude, gw.latitude]}
                              properties={{title: gw.name, description: gw.properties}}
                             />
        ));
    return (
        <Layer type="symbol" id="marker"
               layout={{ "icon-image": "marker-15" }}>
               {GatewayFeatures}
        </Layer>
    );
  }
}


export default MapGateways;
