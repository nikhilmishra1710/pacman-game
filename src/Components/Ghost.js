import React from "react";
import "./Ghost.css";

export default function Ghost({ ghosts, colIndex, rowIndex }) {

    const ghostsObj = ghosts?.find((element) => element.x === colIndex && element.y === rowIndex);
    const direction = ghostsObj.dirn;
    const className = `ghost ghost${direction}`;
    return <div className={className}></div>;
}
