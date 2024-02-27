import React from "react";
import "./Pacman.css";

export default function Pacman({ pacman }) {
    const direction = pacman.dirn;
    const className = `pacman pacman${direction}`;
    return (
        <div className={className}>
        </div>
    );
}
