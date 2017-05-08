import React, { Component } from 'react';
import { Layer, Feature } from "react-mapbox-gl";

import NodeStore from "../../stores/NodeStore";

class NodeLayer extends Component {

  constructor() {
    super();
    this.state = {
      nodes: [],
      message: [],
      circleRadius: 4.5
    };
  }

  componentDidMount() {
    this.updateMapNodes(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateMapNodes(nextProps);
  }

  updateMapNodes(props) {
    NodeStore.getNodeLocation((nodes) => {
      this.setState({
        nodes: nodes,
      });
    });
  }

  render() {
    const {nodes, circleRadius} = this.state;

    const NodesFeatures = nodes.map((node, i) =>
      <Feature
        key={node.time}
        coordinates={[node.location.y, node.location.x]}
        properties={{rssi: node.gw_rssi}}
      />
    );

    // <Feature
    //   properties={{rssi: -130}}
    //   coordinates={[12.1866103, 52.5170092]}
    // />
    // <Feature
    //   properties={{rssi: -116}}
    //   coordinates={[12.2867103, 52.5170092]}
    // />
    // <Feature
    //   properties={{rssi: -113}}
    //   coordinates={[12.3868103, 52.5170092]}
    // />
    // <Feature
    //   properties={{rssi: -107}}
    //   coordinates={[12.4869103, 52.5170092]}
    // />
    // <Feature
    //   properties={{rssi: -102}}
    //   coordinates={[12.5870103, 52.5170092]}
    // />

    // remeber never mix manual Feature and dynamic List
    return (
      <Layer
        id="clusters"
        type="circle"
        paint={{
          "circle-radius": circleRadius,
          "circle-color": {
                property: "rssi",
                stops: [
                    [-300, "#1a237e"],
                    [-120, "#18FFFF"],
                    [-115, "#00E676"],
                    [-110, "#FFEB3B"],
                    [-105, "#FF9800"],
                    [-100, "#FF5722"],
                ]
          },
          "circle-opacity": .8 }}>
        {NodesFeatures}
      </Layer>
    );
  }
}


export default NodeLayer;
