import React from 'react'

const AccessibleHelperCard = (props) => {
    const{ status, name} = props;
    let boxStyle = {};

    if (status === 'available') {
        boxStyle = {
          backgroundColor: "#ffffff",
          border: "2px solid #0E9E52",
        };
      } else if (status === 'active') {
        boxStyle = {
          backgroundColor: "#0E9E52",
          border: "2px solid #0E9E52",
        };
      }else if (status === 'help') {
        boxStyle = {
          backgroundColor: "#F03300",
          border: "2px solid #F03300",
        };
      }

  return (
    <div className="helper">
        <div className="boxStyle" style={boxStyle}></div>
        <p>{name}</p>
    </div>
  )
}

export default AccessibleHelperCard