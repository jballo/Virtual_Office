import React, {useEffect, useRef, useState } from 'react';
import MyVideo from './MyVideo';
import InitiatedVideoCall from './InitiatedVideoCall';
import { connect } from 'react-redux';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';



function VideoCalls({myCharacterData, otherCharactersData, webrtcSocket}) {
    const [myStream, setMyStream] = useState();
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then((stream) => {
                setMyStream(stream);
            });
    }, []);


    const myUserId = myCharacterData?.id;
    const initiateCallToUsers = Object.keys(otherCharactersData)
        .filter((othersUserId) => othersUserId >= myUserId)
        .reduce((filteredObj, key) => {
            filteredObj[key] = otherCharactersData[key];
            return filteredObj;
        }, {});
    
    const listenPeer = () => {

        webrtcSocket.on('sendOffer', ({callToUserSocketId, callFromUserSocketId, offerSignal}) => {
            console.log('receiving offer from ', callFromUserSocketId, 'to ', callToUserSocketId);
        });

    };

    useEffect(() => {
        listenPeer();
    }, []);
    

    return <>{
        myCharacterData && <div className='videos' >
            <MyVideo myStream={myStream} />
            {
                Object.keys(initiateCallToUsers).map((othersUserId) => {
                    return <InitiatedVideoCall
                        key={initiateCallToUsers[othersUserId].socketId}
                        mySocketId={myCharacterData.socketId}
                        myStream={myStream}
                        othersSocketId={initiateCallToUsers[othersUserId].socketId}
                        webrtcSocket={webrtcSocket}
                    />
                })
            }
        </div>
    }</>
}


const mapStateToProps = (state) => {
    const myCharacterData = state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id];
    const otherCharactersData = Object.keys(state.allCharacters.users)
        .filter(id => id != MY_CHARACTER_INIT_CONFIG.id)
        .reduce((filteredObj, key) => {
            filteredObj[key] = state.allCharacters.users[key];
            return filteredObj;
        }, {});
    
    return {myCharacterData: myCharacterData, otherCharactersData: otherCharactersData};
};


export default connect(mapStateToProps, {})(VideoCalls);