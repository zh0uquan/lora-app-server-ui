import React, { Component } from "react";

class Drawer extends React.Component {

  // componentDidUpdate(prevProps) {
  //   if (!prevProps.visible && this.props.visible) {
  //     setTimeout(() => this.refs.container.focus(), 350);
  //   }
  // }

  render() {
    const { id, visible } = this.props;

    return (
      <div
        ref="container"
        id={id}
        role="navigation"
        className="Drawer"
        display={visible ? 'none' : 'true'}
        tabIndex="0">
        {this.props.children}
      </div>
    );
  }
}

export default Drawer;
