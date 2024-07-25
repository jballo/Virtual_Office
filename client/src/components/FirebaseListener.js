import React, {useEffect} from 'react';
import {ref, onValue } from 'firebase/database';
import { firebaseDatabase } from '../firebase/firebase';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';



export const FirebaseListener = ({allCharactersData, updateAllCharactersData}) => {
    useEffect(() => {
        // Create a reference to the location of user's position in firebase
        const positionRef = ref(firebaseDatabase, 'users/' + MY_CHARACTER_INIT_CONFIG.id + '/position');

        let unsubscribe = onValue(positionRef, (positionSnapshot) => {
            console.log("Listener detected value changes in 'users/[MY_CHARACTER_INIT_CONFIG.id]/positon'");
            // Retrieve and assign json info for my character into a variable
            const myCharacterData = allCharactersData[MY_CHARACTER_INIT_CONFIG.id];
            // Assign the returned position from firebase to variable
            const newPosition = positionSnapshot.val();
            // Create a new character with the same character config, except updated position retrieved from firebase
            const newCharacter = {
                ...myCharacterData,
                position: newPosition
            };
            // Update the character data for just your character, while retaining all users
            updateAllCharactersData({...allCharactersData, [MY_CHARACTER_INIT_CONFIG.id]: newCharacter});
        });

        return () => {
            // Remove listener so that even when FirebaseListener is unmounted, and re-mounted, we will only have one listener
            unsubscribe()
            console.log("Listener to 'users/[MY_CHARACTER_INIT_CONFIG.id]/positon' removed.");
        }
        // An empty dependency array will ensure that useEffect is only ran once in the beginning and not during re-renders for FirebaseListener
        // -> Guarantees we only have one listener while re-rendering
    },[]);
}

