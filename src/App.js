import React, { useState, useEffect } from "react";
import "./App.css"; // Import your CSS file
import File from "./file";

const PacManGame = () => {
    // State for PacMan position and game map
    const [pacman, setPacman] = useState({ x: 6, y: 4, dirn: "N" });
    const [ghost, setGhost] = useState([{ x: 7, y: 7, prev: { x: 7, y: 7, val: 3 } }]);
    const [map, setMap] = useState([
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
        [1, 2, 2, 2, 1, 1, 5, 1, 1, 2, 2, 2, 1],
        [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
        [1, 2, 1, 1, 2, 2, 1, 2, 2, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]);
    const [gameOver, setGameOver] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [intervalGhostId, setIntervalGhostId] = useState(null);
    const [gameStart, setGameStart] = useState(false);

    useEffect(() => {
        // console.log(map);
    }, [map]);
    useEffect(() => {
        // console.log(ghost);
    }, [ghost]);

    // useEffect(() => {
    //     console.log(ghost);
    // }, [ghost]);

    // Function to handle PacMan movement
    const handleKeyDown = (event) => {
        if (gameStart === false) {
            setGameStart(true);
            if (!intervalId) {
                // movePlayer();
                setIntervalId(setInterval(movePlayer, 10000));
            }
            if (!intervalGhostId) {
                // moveGhost();
                setIntervalGhostId(setInterval(moveGhost, 10000));
            }
        }

        if (gameOver) {
            clearInterval(intervalId);
            clearInterval(intervalGhostId);
            return; // If the game is over, don't handle key events
        }
        if (event.keyCode === 37) {
            setPacman((prevPacman) => {
                const newPacman = { ...prevPacman };
                newPacman.dirn = "L";
                return newPacman;
            });
        } else if (event.keyCode === 38) {
            setPacman((prevPacman) => {
                const newPacman = { ...prevPacman };
                newPacman.dirn = "U";
                return newPacman;
            });
        } else if (event.keyCode === 39) {
            setPacman((prevPacman) => {
                const newPacman = { ...prevPacman };
                newPacman.dirn = "R";
                return newPacman;
            });
        } else if (event.keyCode === 40) {
            setPacman((prevPacman) => {
                const newPacman = { ...prevPacman };
                newPacman.dirn = "D";
                return newPacman;
            });
        }
        // Check for winning condition after each movement
        checkWinningCondition();
    };
    // Function to check for winning condition and collision detection
    const checkWinningCondition = () => {
        if (!map.some((row) => row.includes(2))) {
            setGameOver(true);
            alert("Congratulations! You collected all the coins. You win!");
            // Additional logic for restarting the game or other actions
        } else {
            ghost.map((ghostObj) => {
                if (ghostObj.x === pacman.x && ghostObj.y === pacman.y) {
                    setGameOver(true);
                    handleKeyDown(null);
                }
            });
        }
    };

    // Initial rendering
    // useEffect(() => {
    //     const handleKeyDownEvent = (event) => handleKeyDown(event);
    //     document.addEventListener("keydown", handleKeyDownEvent);
    //     // Cleanup event listener on component unmount
    //     return () => {
    //         document.removeEventListener("keydown", handleKeyDownEvent);
    //     };
    // }, [handleKeyDown]);

    const moveGhost = () => {
        const directions = [
            { x: 0, y: -1 }, // up
            { x: 0, y: 1 }, // down
            { x: -1, y: 0 }, // left
            { x: 1, y: 0 }, // right
        ];
        setGhost((prevGhosts) => {
            
                const newGhost = [];
                prevGhosts.forEach((ghostObj) => {
                    const direction = directions[Math.floor(Math.random() * directions.length)];
                    if (
                        ghostObj.y + direction.y >= 0 &&
                        ghostObj.y + direction.y < map.length &&
                        ghostObj.x + direction.x >= 0 &&
                        ghostObj.x + direction.x < map[0].length &&
                        map[ghostObj.y + direction.y][ghostObj.x + direction.x] !== 1 &&
                        map[ghostObj.y + direction.y][ghostObj.x + direction.x] !== 4
                    ) {
                        const newGhostObj = { ...ghostObj };
                        newGhostObj.y += direction.y;
                        newGhostObj.x += direction.x;
                        newGhostObj.prev = {
                            y: ghostObj.y,
                            x: ghostObj.x,
                            val: map[ghostObj.y + direction.y][ghostObj.x + direction.x],
                        };
                        newGhost.push(newGhostObj);
                        // newGhost.push({
                        //     // ...ghostObj,
                        //     y: ghostObj.y + direction.y,
                        //     x: ghostObj.x + direction.x,
                        //     prev: {
                        //         y: ghostObj.y,
                        //         x: ghostObj.x,
                        //         val: map[ghostObj.y + direction.y][ghostObj.x + direction.x],
                        //     },
                        // });
                    } else {
                        newGhost.push(ghostObj); // Keep the ghost in the same position if it can't move
                    }
                    console.log(ghostObj.prev.val);
                });          

            console.log("newGhost :",newGhost.length);

            setMap((prevMap) => {
                const newMap = [...prevMap]; // Create a deep copy of the map
                newGhost.forEach((ghost) => {
                    newMap[ghost.y][ghost.x] = 4; // Set the new ghost positions

                    newMap[ghost.prev.y][ghost.prev.x] = ghost.prev.val;
                    console.log("newpos:",
                        newMap[ghost.y][ghost.x],
                        "prevpos:", 
                        newMap[ghost.prev.y][ghost.prev.x],[ghost.prev.y],[ghost.prev.x]
                    ); // Set the old ghost position to the prev value
                });
                console.log("newMap :",newMap);
                return newMap;
            });

            return newGhost;
        });
        // ghost.map((ghostObj, index) => {
        //     const direction = directions[Math.floor(Math.random() * directions.length)];
        //     if (
        //         ghostObj.y + direction.y >= 0 &&
        //         ghostObj.y + direction.y < map.length &&
        //         ghostObj.x + direction.x >= 0 &&
        //         ghostObj.x + direction.x < map[0].length &&
        //         (map[ghostObj.y + direction.y][ghostObj.x + direction.x] !== 1 || map[ghostObj.y + direction.y][ghostObj.x + direction.x] !== 4)
        //     )
        //         setMap((prevMap) => {
        //             const newMap = [...prevMap];
        //             newMap[ghostObj.y][ghostObj.x] = 2; // Clear the old ghostObj position
        //             setGhost((prevGhosts) => {
        //                 const newGhosts = [...prevGhosts];
        //                 newGhosts[index] = {
        //                     ...newGhosts[index],
        //                     x: newGhosts[index].x + direction.x,
        //                     y: newGhosts[index].y + direction.y,
        //                 };
        //                 return newGhosts;
        //             });
        //             newMap[ghostObj.y + direction.y][ghostObj.x + direction.x] = 4; // Set the new ghostObj position

        //             return newMap;
        //         });
        // });
        checkWinningCondition();
    };

    const movePlayer = () => {
        // console.log("movePlayer pacman:", pacman);
        const directions = {
            L: { x: -1, y: 0 },
            R: { x: 1, y: 0 },
            U: { x: 0, y: -1 },
            D: { x: 0, y: 1 },
            N: { x: 0, y: 0 },
        };
        setPacman((prevPacman) => {
            const newPacman = { ...prevPacman };
            newPacman.x += directions[newPacman.dirn].x;
            newPacman.y += directions[newPacman.dirn].y;
            setMap((prevMap) => {
                const newMap = [...prevMap];
                if (newPacman.y >= 0 && newPacman.y < map.length && newPacman.x >= 0 && newPacman.x < map[0].length && newMap[newPacman.y][newPacman.x] !== 1) {
                    newMap[prevPacman.y][prevPacman.x] = 3; // Clear the old PacMan position
                    newMap[newPacman.y][newPacman.x] = 5; // Set the new PacMan position
                } else {
                    newPacman.y = prevPacman.y;
                    newPacman.x = prevPacman.x;
                }
                return newMap;
            });
            return newPacman;
        });
        checkWinningCondition();
    };

    return (
        // <div id="world" style={{ backgroundColor: "white" }}>
        //     {map.map((row, rowIndex) => (
        //         <div key={rowIndex}>
        //             {row.map((cell, colIndex) => (
        //                 <div
        //                     key={colIndex}
        //                     className={cell === 1 ? "wall" : cell === 2 ? "coin" : cell === 3 ? "ground" : cell === 4 ? "ghost" : cell === 5 ? "pacman" : null}
        //                     style={
        //                         cell === 1
        //                             ? { background: "black" }
        //                             : cell === 2
        //                             ? { background: "white" }
        //                             : cell === 3
        //                             ? { background: "grey" }
        //                             : cell === 4
        //                             ? { background: "blue" }
        //                             : cell === 5
        //                             ? { background: "yellow" }
        //                             : null
        //                     }
        //                 ></div>
        //             ))}
        //         </div>
        //     ))}
        // </div>
        <File/>
    );
};

export default PacManGame;
