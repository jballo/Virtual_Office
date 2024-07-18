import React, {useCallback, useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import CanvasContext from './CanvasContext';

import {MOVE_DIRECTIONS, MAP_DIMENSIONS, TILE_SIZE} from './mapConstants';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import {checkMapCollision} from './utils';
import {update as updateAllCharactersData} from './slices/allCharactersSlice'


const GameLoop = ({children, allCharactersData, updateAllCharactersData}) => {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    useEffect(() => {
        // frameCount used for re-rendering child components
        console.log("initial setContext");
        setContext({canvas: canvasRef.current.getContext('2d'), frameCount: 0});
    }, [setContext]);

    // keeps the reference to the main rendering loop
    const loopRef = useRef();
    const mycharacterData = allCharactersData[MY_CHARACTER_INIT_CONFIG.id];

    const moveMyCharacter = useCallback((e) => {
        var currentPosition = mycharacterData.position;
        const key = e.key;
        // condition passes when wasd key is pressed
        if (MOVE_DIRECTIONS[key]) {
            // ***********************************************
            // TODO: Add your move logic here
            // Log key being pressed
            console.log("Key pressed.")
            // logging key pressed and movement
            console.log("Key " + key + ": " + MOVE_DIRECTIONS[key]);

            // logging current x and y coordinates when keys are pressed
            console.log("X: " + currentPosition["x"] + ", Y: " + currentPosition["y"]);
            
            // Extract movement from an array (ex. [0, 1]) into horizontal and vertical movement (dx, dy)
            const [dx, dy] = MOVE_DIRECTIONS[key];

            // create a new character with the same character config, except updated position
            const newCharacter = {
                ...mycharacterData,
                position: {
                    x: currentPosition.x + dx,
                    y: currentPosition.y + dy,
                },
            };
            // Update the character data for just your character, while retaining all users
            updateAllCharactersData({...allCharactersData, [MY_CHARACTER_INIT_CONFIG.id]: newCharacter});
        }
    }, [mycharacterData, updateAllCharactersData]);

    const tick = useCallback(() => {
        if (context != null) {
            setContext({canvas: context.canvas, frameCount: (context.frameCount + 1) % 60});
        }
        loopRef.current = requestAnimationFrame(tick);
    }, [context]);

    useEffect(() => {   
        loopRef.current = requestAnimationFrame(tick);
        return () => {
            loopRef.current && cancelAnimationFrame(loopRef.current);
        }
    }, [loopRef, tick])

    useEffect(() => {
        document.addEventListener('keypress', moveMyCharacter);
        return () => {
            document.removeEventListener('keypress', moveMyCharacter);
        }
    }, [moveMyCharacter]);

    return (
        <CanvasContext.Provider value={context}>
            <canvas
                ref={canvasRef} 
                width={TILE_SIZE * MAP_DIMENSIONS.COLS}
                height={TILE_SIZE * MAP_DIMENSIONS.ROWS}
                class="main-canvas"
            />
            {children}
        </CanvasContext.Provider>
    );
};


const mapStateToProps = (state) => {
    return {allCharactersData: state.allCharacters.users};
};

const mapDispatch = {updateAllCharactersData};


export default connect(mapStateToProps, mapDispatch)(GameLoop);

