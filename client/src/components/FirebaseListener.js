import React, {useEffect} from 'react';
import {ref, onValue } from 'firebase/database';
import { firebaseDatabase } from '../firebase/firebase';



export const FirebaseListener = ({updateAllCharactersData}) => {
    useEffect(() => {
        // Create a reference to the users in firebase
        const usersRef = ref(firebaseDatabase, 'users/');

        let unsubscribe = onValue(usersRef, (usersSnapshot) => {
            console.log("Listener detected value changes in 'users/'");
                
            // Retrieve and assign json info for users into a variable
            const newAllCharacterData = usersSnapshot.val();
            console.log(newAllCharacterData);
            updateAllCharactersData(newAllCharacterData);
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

