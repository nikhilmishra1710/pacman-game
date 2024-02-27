import React, { useEffect, useRef, useState } from "react";
import Level from "./Datas/Level";
import Pacman from "./Components/Pacman";
import Ghost from "./Components/Ghost";
import Wall from "./Components/Wall";
import Coin from "./Components/Coin";
import Ground from "./Components/Ground";
import EmptyCell from "./Components/EmptyCell";

export default function File() {
    const [gameStart, setGameStart] = useState(false);
    const [map, setMap] = useState([]);
    const [pacman, setPacman] = useState(null);
    const playerInterval = useRef(null);
    const [ghosts, setGhosts] = useState(null);
    // const [ghostInterval, setGhostInterval] = useState(null);
    const [keydown, setKeyDown] = useState(false);
    const gameOver = useRef(false);
    const [loadGame, setLoadGame] = useState(false);
    const score = useRef(0);
    const [limit, setLimit] = useState(0);
    const directions = {
        U: { dx: 0, dy: -1 },
        D: { dx: 0, dy: 1 },
        L: { dx: -1, dy: 0 },
        R: { dx: 1, dy: 0 },
        N: { dx: 0, dy: 0 },
    };
    const [level, setLevel] = useState(1);

    useEffect(() => {
        console.log("pacman:", pacman);
    }, [pacman]);
    useEffect(() => {
        console.log("map:", map);
    }, [map]);
    useEffect(() => {
        console.log("ghosts:", ghosts);
    }, [ghosts]);
    useEffect(() => {
        console.log("playerInterval: ", playerInterval);
    }, [playerInterval]);

    useEffect(() => {
        console.log("gameOver: ", gameOver);
    }, [gameOver]);
    useEffect(() => {
        console.log("gameStart: ", gameStart);
    }, [gameStart]);
    useEffect(() => {
        console.log("score: ", score);
    }, [score]);

    const movePacman = (e) => {
        if (gameOver.current && gameStart) return;
        if (!keydown) {
            gameOver.current = false;
            setKeyDown(true);

            if (!gameStart) {
                setGameStart(true);
                if (!playerInterval.current) {
                    playerInterval.current = setInterval(updatePos, 800);
                    console.log("playerInterval: ", playerInterval);
                }
            }

            setPacman((prevPacman) => {
                let newPacman = { ...prevPacman };
                if (e.keyCode === 38) {
                    newPacman.dirn = "U";
                }
                if (e.keyCode === 40) {
                    newPacman.dirn = "D";
                }
                if (e.keyCode === 37) {
                    newPacman.dirn = "L";
                }
                if (e.keyCode === 39) {
                    newPacman.dirn = "R";
                }

                return newPacman;
            });
        }
    };

    const updatePos = () => {
        updatePacmanPos();
        updateGhostsPos();
    };

    const updatePacmanPos = () => {
        setPacman((prevPacman) => {
            const newPacman = { ...prevPacman };
            const { dx, dy } = directions[newPacman.dirn];

            if (validPosition(newPacman.x, newPacman.y, dx, dy)) {
                newPacman.y += dy;
                newPacman.x += dx;
            }

            setMap((prevMap) => {
                const newMap = [...prevMap];
                if (newMap[newPacman.y][newPacman.x] === 2) {
                    score.current++;
                }
                newMap[prevPacman.y][prevPacman.x] = 3;
                newMap[newPacman.y][newPacman.x] = 5;
                return newMap;
            });

            return newPacman;
        });

        if (score.current === limit) {
            setLevel((prevLevel) => prevLevel + 1);
            clearInterval(playerInterval.current);
            playerInterval.current = null;
        }
    };

    const updateGhostsPos = () => {
        const newGhosts = [...ghosts];
        newGhosts.forEach((element) => {
            const { dx, dy } = directions[element.dirn];

            if (validPosition(element.x, element.y, dx, dy) && map[element.y + dy][element.x + dx] !== 4) {
                element.px = element.x;
                element.py = element.y;
                element.x += dx;
                element.y += dy;
                element.pv = element.v;
                element.v = map[element.y][element.x];
                element.dirn = dx === 0 ? (dy === 1 ? "D" : "U") : dx === -1 ? "L" : "R";
                if (element.v === 5) {
                    alert("Pacman eaten by ghost");
                    clearInterval(playerInterval.current);
                    gameOver.current = true;
                }
                if (Math.random() > 0.4) {
                    if (element.dirn === "U" || element.dirn === "D") {
                        if (
                            map[element.y][element.x + 1] !== 1 &&
                            map[element.y][element.x + 1] !== 4 &&
                            map[element.y][element.x - 1] !== 1 &&
                            map[element.y][element.x - 1] !== 4
                        ) {
                            element.dirn = Math.random() > 0.5 ? "R" : "L";
                        } else if (map[element.y][element.x + 1] !== 1 && map[element.y][element.x + 1] !== 4) {
                            element.dirn = "R";
                        } else if (map[element.y][element.x - 1] !== 1 && map[element.y][element.x - 1] !== 4) {
                            element.dirn = "L";
                        }
                        // element.dirn = Math.random() > 0.5 ? "L" : "R";
                        // console.log("Change of direction to", element.dirn);
                    } else {
                        if (
                            map[element.y + 1][element.x] !== 1 &&
                            map[element.y + 1][element.x] !== 4 &&
                            map[element.y - 1][element.x] !== 1 &&
                            map[element.y - 1][element.x] !== 4
                        ) {
                            element.dirn = Math.random() > 0.5 ? "U" : "D";
                        } else if (map[element.y + 1][element.x] !== 1 && map[element.y + 1][element.x] !== 4) {
                            element.dirn = "D";
                        } else if (map[element.y - 1][element.x] !== 1 && map[element.y - 1][element.x] !== 4) {
                            element.dirn = "U";
                        }
                        // console.log("Change of direction to", element.dirn);
                    }
                }
            } else if (map[element.y + dy][element.x + dx] === 5 || map[element.y][element.x] === 5) {
                alert("Pacman eaten by ghost");
                clearInterval(playerInterval.current);
                gameOver.current = true;
            } else {
                if (element.dirn === "U" || element.dirn === "D") {
                    if (map[element.y][element.x + 1] !== 1 && map[element.y][element.x + 1] !== 4 && map[element.y][element.x - 1] !== 1 && map[element.y][element.x - 1] !== 4) {
                        element.dirn = Math.random() > 0.5 ? "R" : "L";
                    } else if (map[element.y][element.x + 1] !== 1 && map[element.y][element.x + 1] !== 4) {
                        element.dirn = "R";
                    } else {
                        element.dirn = "L";
                    }
                } else {
                    if (map[element.y + 1][element.x] !== 1 && map[element.y + 1][element.x] !== 4 && map[element.y - 1][element.x] !== 1 && map[element.y - 1][element.x] !== 4) {
                        element.dirn = Math.random() > 0.5 ? "U" : "D";
                    } else if (map[element.y + 1][element.x] !== 1 && map[element.y + 1][element.x] !== 4) {
                        element.dirn = "D";
                    } else {
                        element.dirn = "U";
                    }
                }
            }
        });

        newGhosts.forEach((element) => {
            // console.log([prevPacman.y],[prevPacman.x])
            setMap((prevMap) => {
                const newMap = [...prevMap];
                newMap[element.py][element.px] = element.pv;
                newMap[element.y][element.x] = 4;
                // console.log("Map update");
                return newMap;
            });
        });

        setGhosts(newGhosts);
    };

    function validPosition(x, y, dx, dy) {
        if (x + dx >= 0 && x + dx < map[0].length && y + dy >= 0 && y + dy < map.length && map[y + dy][x + dx] !== 1) return true;
        else return false;
    }

    const handleKeyUpEvent = () => {
        setKeyDown(false);
    };

    useEffect(() => {
        const handleKeyDownEvent = (event) => movePacman(event);
        document.addEventListener("keydown", handleKeyDownEvent);
        document.addEventListener("keyup", handleKeyUpEvent);

        return () => {
            document.removeEventListener("keydown", handleKeyDownEvent);
            document.removeEventListener("keyup", handleKeyUpEvent);
        };
    }, [movePacman]);

    const restartGame = () => {
        console.log("Restarting game");
        setGameStart(false);
        setMap([]);
        setPacman(null);
        setGhosts(null);
        setKeyDown(false);
        setLoadGame(false);
        score.current = 0;
        window.location.reload();
    };

    useEffect(() => {
        setLoadGame(false);
        gameOver.current = true;
        console.log("Level: ", level);
        const newMap = Level[level]["map"];
        const newPlayerPos = Level[level]["playerPos"];
        const newGhostsPos = Level[level]["ghostsPos"];
        const newLimit = Level[level]["limit"];
        setMap(newMap);
        setPacman(newPlayerPos);
        setGhosts(newGhostsPos);
        setLimit(newLimit);
        setLoadGame(true);
        setGameStart(false);
        score.current = 0;
    }, [level]);

    return (
        <div className="container">
            {loadGame ? (
                <>
                    <div className="btn-div">
                        <div className="flex">
                        <div className="level_details"><span className="First-letter">L</span>EVEL: <span className="First-letter">{level}</span></div>
                        <div>{gameOver.current ? <button className="button-55" onClick={restartGame}>RESTART</button> : <h1>SCORE: {score.current}</h1>}</div>
                        </div>
                        {gameStart ? null : <p>Press any arrow key to start the game</p>}
                    </div>
                    <div id="world" /*style={{ backgroundColor: "white" }}*/>
                        {map.map((row, rowIndex) => (
                            <div key={rowIndex}>
                                {row.map((cell, colIndex) => {
                                    switch (cell) {
                                        case 1:
                                            return <Wall key={colIndex} />;
                                        case 2:
                                            return <Coin key={colIndex} />;
                                        case 3:
                                            return <Ground key={colIndex} />;
                                        case 4:
                                            return <Ghost key={colIndex} ghosts={ghosts} colIndex={colIndex} rowIndex={rowIndex} />;
                                        case 5:
                                            return <Pacman key={colIndex} pacman={pacman} />;
                                        default:
                                            return <EmptyCell key={colIndex} />;
                                    }
                                })}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <h1>LOADING</h1>
            )}
        </div>
    );
}

/*
* 1. The game is a simple Pacman game with a few levels.
* 2. The game has a few components, such as Pacman, Ghost, Wall, Coin, Ground, and EmptyCell.
* 3. The game has a few data files, such as Level.js.
* 4. The game has a few CSS files, such as Pacman.css and Ghost.css.
* 5. The game has a few utility functions, such as validPosition.
* 6. The game has a few event listeners, such as handleKeyDownEvent and handleKeyUpEvent.
* 7. The game has a few state variables, such as gameStart, map, pacman, playerInterval, ghosts, keydown, gameOver, loadGame, score, limit, and level.
* 8. The game has a few useEffect hooks, such as the one that listens for changes in the pacman state variable.
* 9. The game has a few functions, such as movePacman, updatePos, updatePacmanPos, updateGhostsPos, and restartGame.
* 10. The game has a few conditional rendering statements, such as the one that renders the game world.
* 11. The game has a few side effects, such as the one that updates the game world.
* 12. The game has a few dependencies, such as React, useEffect, useRef, and useState.

TO-FIX
* 1. Refactor the code to make components.
* 2. Add a few comments to the code.
* 3. The game has a few console.log statements that need to be removed.
* 4. Add levels and different ghost designs 
* 5. Add a few more features to the game, such as a score board and a game over screen.
*/

