import React, { Component } from "react";

class Drawer extends Component {

  render() {
    const { visible } = this.props;

    return (
      <div
        ref="container"
        role="navigation"
        id="drawer"
        display={visible ? 'none' : 'true'}
        tabIndex="0">
        {this.props.children}
      </div>
    );
  }
}

export default Drawer;
