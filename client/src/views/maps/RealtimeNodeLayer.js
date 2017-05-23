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
      staleNodes: []
    };

  }

  heartbeat() {
    switch (this.state.circleRadius) {
      case 5:
        this.setState({circleRadius: this.state.circleRadius + 2});
        return;
      case 7:
        this.setState({circleRadius: this.state.circleRadius - 2});
        return;
      default:
        return;
    }

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.interval = setInterval(this.heartbeat.bind(this), 1000);

    const ws = new WebSocket(window.location.origin.replace('http', 'ws'));

    ws.onopen = () => {
      ws.send('connecting from websocket');
    }

    ws.onmessage = (evt) => {
      const node = JSON.parse(evt.data);
      let { messageNodes, realtimeNodes, staleNodes} = this.state;

      messageNodes.unshift(node);

      var flag = false;
      for (let i =0; i < realtimeNodes.length; i++) {
        if (realtimeNodes[i].deveui === node.deveui) {
          flag = true;
          staleNodes.push(realtimeNodes[i])
          realtimeNodes[i] = node
          break;
        }
      }

      if (!flag) {
        realtimeNodes.push(node)
      }

      this.setState({
        realtimeNodes: realtimeNodes,
        messageNodes: messageNodes,
        staleNodes: staleNodes
      });
    }
  }

  _onClickDrawer() {
    this.setState({
      visibleDrawer: !this.state.visibleDrawer
    })
  }

  render() {
    const {realtimeNodes, messageNodes, staleNodes, circleRadius, visibleDrawer} = this.state;

    const realtimeNodesFeatures = realtimeNodes.map((node, i) =>
      <Feature
        id="heartbeat"
        key={moment()}
        coordinates={node.coordinates}
        properties={{rssi: node.gw_rssi}}
      />
    );

    const staleNodesFeatures = staleNodes.map((node, i) =>
      <Feature
        id="stale"
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
        <p>SNR: {parseFloat(node.gw_snr).toFixed(1) }</p>
        <p>Gateway: {node.gw_mac}</p>
        <p>Message: No.{node.fcnt}</p>
        <p>Radio: SF{node.tx_spreadfactor}BW{node.tx_bandwidth}</p>
      </ListGroupItem>
    );

    // remeber never mix manual Feature and dynamic List
    return (
      <div>
        <Layer
          id="stale nodes"
          type="circle"
          paint={{
            "circle-radius": 5,
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
          {staleNodesFeatures}
        </Layer>
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
            <div id="drawer-container" className="col-md-offset-10 col-md-2 col-xs-offset-2 col-xs-10">
              <Button
                bsStyle="primary"
                onClick={this._onClickDrawer.bind(this)}
                aria-expanded={visibleDrawer? 'true' : 'false'}>
                  Show Realtime Message
              </Button>
              <Drawer visible={visibleDrawer}>
                <ListGroup id="realtime-info">
                  <ListGroupItem className='header'>
                    <div onClick={this._onClickDrawer.bind(this)}>
                      <i className="fa fa-times fa-lg" aria-hidden="true" ></i>
                    </div>
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
