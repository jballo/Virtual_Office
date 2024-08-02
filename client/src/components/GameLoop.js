import React, {useCallback, useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import CanvasContext from './CanvasContext';

import {MOVE_DIRECTIONS, MAP_DIMENSIONS, TILE_SIZE} from './mapConstants';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import {checkMapCollision} from './utils';
import {update as updateAllCharactersData} from './slices/allCharactersSlice'
import {set, ref} from 'firebase/database';
import { firebaseDatabase } from '../firebase/firebase';
import { FirebaseListener } from './FirebaseListener';


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
            
            // Extract movement from an array (ex. [0, 1]) into horizontal and vertical movement (dx, dy)
            const [dx, dy] = MOVE_DIRECTIONS[key];

            // Create a reference to the location of user's position in firebase
            const positionRef = ref(firebaseDatabase, 'users/' + MY_CHARACTER_INIT_CONFIG.id + '/position');

            // Update coordinates/position for the reference of the position
            set(positionRef, {
                x: currentPosition.x + dx, 
                y: currentPosition.y + dy
            });


        }
    }, [mycharacterData]);

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
            <FirebaseListener updateAllCharactersData={updateAllCharactersData}/>
            {children}
        </CanvasContext.Provider >
    );
};


const mapStateToProps = (state) => {
    return {allCharactersData: state.allCharacters.users};
};

const mapDispatch = {updateAllCharactersData};


export default connect(mapStateToProps, mapDispatch)(GameLoop);

