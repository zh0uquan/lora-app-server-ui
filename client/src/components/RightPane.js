import React from 'react';

const RightPane = (props) => {
  return (
    <div id="page-content-main">
      <div className="container-fluid">
        <div className="row">
          {props.children}
        </div>
      </div>
    </div>
  );
}


export default RightPane;
