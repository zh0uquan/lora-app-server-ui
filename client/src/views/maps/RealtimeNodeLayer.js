import moment from 'moment';

import React, { Component } from 'react';
import { Layer, Feature } from 'react-mapbox-gl';

import {ListGroup, ListGroupItem, Button} from 'react-bootstrap'

import Drawer from '../../components/Drawer';

class RealtimeNodeLayer extends Component {

  constructor() {
    super();
    this.state = {
      circleRadius: 7,
      realtimeNodes: [],
      messageNodes: [],
    };

    this._watch();
  }

  _watch(props) {
    const ws = new WebSocket(window.location.origin.replace('http', 'ws'));

    ws.onopen = () => {
      ws.send('connecting from websocket');
    }

    ws.onmessage = (evt) => {
      const node = JSON.parse(evt.data);
      console.log(node);
      var messageNodes = this.state.messageNodes;
      if (messageNodes.length < 5) {
        messageNodes.push(node);
      } else {
        messageNodes.shift()
        messageNodes.push(node);
      }
      this.setState({
        realtimeNodes: [node],
        messageNodes: messageNodes
      });
    }
  }

  _onClickDrawer() {
    this.setState({
      visibleDrawer: !this.state.visibleDrawer
    })
  }

  _add() {
    var messageNodes = this.state.messageNodes;
    if (messageNodes.length < 10) {
      messageNodes.push({"time":moment().format('YYYY-MM-DD HH:mm:ss'),"applicationid":1,"deveui":"78af58fffe040005","gw_mac":"00005fa4b26323ce","gw_rssi":-49,"gw_snr":9.5,"tx_frequency":868100000,"tx_modulation":"LORA","tx_bandwidth":125,"tx_spreadfactor":7,"tx_adr":true,"tx_coderate":"4/5","fcnt":1923,"fport":1,"battery_voltage":4080,"location":"(52.520016666666663,13.403166666666667)","altitude":null,"sensor_type":null,"sensor_value":null,"coordinates":["13.40317","52.52002"]});
    } else {
      messageNodes.shift()
      messageNodes.push({"time":moment().format('YYYY-MM-DD HH:mm:ss'),"applicationid":1,"deveui":"78af58fffe040005","gw_mac":"00005fa4b26323ce","gw_rssi":-49,"gw_snr":9.5,"tx_frequency":868100000,"tx_modulation":"LORA","tx_bandwidth":125,"tx_spreadfactor":7,"tx_adr":true,"tx_coderate":"4/5","fcnt":1923,"fport":1,"battery_voltage":4080,"location":"(52.520016666666663,13.403166666666667)","altitude":null,"sensor_type":null,"sensor_value":null,"coordinates":["13.40317","52.52002"]});
    }
    this.setState({
      messageNodes: messageNodes
    })
  }

  render() {
    const {realtimeNodes, messageNodes, circleRadius, visibleDrawer} = this.state;

    const realtimeNodesFeatures = realtimeNodes.map((node, i) =>
      <Feature
        key={moment()}
        coordinates={node.coordinates}
        properties={{rssi: node.gw_rssi}}
      />
    );

    const message = messageNodes.map((node, i) =>
      <ListGroupItem key={node.fcnt + node.deveui}>
        <p>Time Send: {moment(node.time).format('YYYY-MM-DD HH:mm:ss')}</p>
        <p>Signal Strength: {node.gw_rssi}</p>
        <p>Deveui: {node.deveui}</p>
        <p>SNR: {node.gw_snr}</p>
        <p>Gateway: {node.gw_mac}</p>
        <p>Message No.:{node.fcnt}</p>
      </ListGroupItem>
    );

    // remeber never mix manual Feature and dynamic List
    return (
      <div>
        <Layer
          id="cluster-realtime"
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
          {realtimeNodesFeatures}
        </Layer>
        <div className="container-fluid">
          <div className="row">
            <div id="drawer-container" className="col-md-offset-10 col-md-2 col-xs-12">
              <Button
                bsStyle="primary"
                onClick={this._onClickDrawer.bind(this)}
                aria-expanded={visibleDrawer? 'true' : 'false'}>
                  Show Realtime Message
              </Button>
              <Drawer visible={visibleDrawer}>
                <ListGroup id="realtime-info">
                  <ListGroupItem>
                    <div onClick={this._onClickDrawer.bind(this)}>
                      <i className="fa fa-times fa-lg" aria-hidden="true" ></i>
                    </div>
                    <Button onClick={this._add.bind(this)}>Default</Button>
                  </ListGroupItem>
                  {message}
                </ListGroup>
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default RealtimeNodeLayer;
