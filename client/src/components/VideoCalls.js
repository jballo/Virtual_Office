import React, {useEffect, useRef, useState } from 'react';
import MyVideo from './MyVideo';
import InitiatedVideoCall from './InitiatedVideoCall';
import { connect } from 'react-redux';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import ReceivedVideoCall from './ReceivedVideoCall';



function VideoCalls({myCharacterData, otherCharactersData, webrtcSocket}) {
    const [myStream, setMyStream] = useState();
    const [offersReceived, setOffersReceived] = useState({});
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then((stream) => {
                setMyStream(stream);
            });
    }, []);

    useEffect(() => {
        webrtcSocket.on("receiveOffer", payload => {
            console.log('receiving offer from ', payload.callFromUserSocketId, 'to ', Object.keys(offersReceived));
            if(!Object.keys(offersReceived).includes(payload.callFromUserSocketId)){
                setOffersReceived({
                    ...offersReceived,
                    [payload.callFromUserSocketId]: payload.offerSignal
                });
            }
        })
    },[webrtcSocket, offersReceived])


    // const listenPeer = () => {

    //     webrtcSocket.on('sendOffer', ({callToUserSocketId, callFromUserSocketId, offerSignal}) => {
    //         console.log('receiving offer from ', callFromUserSocketId, 'to ', callToUserSocketId);
    //     });

    // };

    // useEffect(() => {
    //     listenPeer();
    // }, []); 



    

    const myUserId = myCharacterData?.id;
    const initiateCallToUsers = Object.keys(otherCharactersData)
        .filter((othersUserId) => othersUserId >= myUserId)
        .reduce((filteredObj, key) => {
            filteredObj[key] = otherCharactersData[key];
            return filteredObj;
        }, {});
    

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
            {
                Object.keys(offersReceived).map((othersSocketId) => {
                    const matchingUserIds = Object.keys(otherCharactersData)
                        .filter((otherUserId) => otherCharactersData[otherUserId].socketId === othersSocketId);
                    console.assert(
                        matchingUserIds.length === 1,
                        "Unexpected list of matchingUserIds: ",
                        matchingUserIds
                    );
                    return <ReceivedVideoCall 
                        key={othersSocketId}
                        mySocketId={myCharacterData.socketId}
                        myStream={myStream}
                        othersSocketId={othersSocketId}
                        webrtcSocket={webrtcSocket}
                        offerSignal={offersReceived[othersSocketId]} />
                })
            }
        </div>
    }</>
}


const mapStateToProps = (state) => {
    const myCharacterData = state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id];
    const otherCharactersData = Object.keys(state.allCharacters.users)
        .filter(id => id !== MY_CHARACTER_INIT_CONFIG.id)
        .reduce((filteredObj, key) => {
            filteredObj[key] = state.allCharacters.users[key];
            return filteredObj;
        }, {});
    
    return {myCharacterData: myCharacterData, otherCharactersData: otherCharactersData};
};


export default connect(mapStateToProps, {})(VideoCalls);