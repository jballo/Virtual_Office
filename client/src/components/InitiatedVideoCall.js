import React, { useEffect, useRef, useCallback, useState } from 'react';
import Peer from 'simple-peer';


function InitiatedVideoCall ({ mySocketId, myStream, othersSocketId, webrtcSocket }) {
    const peerRef = useRef();
    const myVideoRef = useRef();
    const peerVideoRef = useRef();

    const createPeer = useCallback((othersSocketId, mySocketId, myStream, webrtcSocket) => {
        const peer = new Peer({
            initiator: true,
            stream: myStream,
            trickle: false,
        });

        peer.on('signal', signal => {
            console.log('sending offer from ', mySocketId, 'to ', othersSocketId);
            webrtcSocket.emit('sendOffer', {
                callToUserSocketId: othersSocketId,
                callFromUserSocketId: mySocketId,
                offerSignal: signal,
            });
        });

        peer.on('stream', stream => {
            if(peerVideoRef.current){
                peerVideoRef.current.srcObject = stream;
            }
        })

        return peer;
    }, []);

    useEffect(() => {
        peerRef.current = createPeer(othersSocketId, mySocketId, myStream, webrtcSocket);

        if (myVideoRef.current){
            myVideoRef.current.srcObject = myStream;
        }

        // webrtcSocket.off('receiveAnswer');
        webrtcSocket.on('receiveAnswer', ({ callToUserSocketId, answerSignal }) => {
            console.log("Received answer signal from ", callToUserSocketId);
            if (callToUserSocketId === othersSocketId) {
                console.log('Received answer signal:', answerSignal);
            } else {
                console.log('Socket ID mismatch. Expected:', mySocketId, 'but got:', callToUserSocketId);
            }
        });

    }, [mySocketId, myStream, othersSocketId, webrtcSocket]);

    return (
        <div>
            <video ref={myVideoRef} autoPlay muted />
            <video ref={peerVideoRef} autoPlay />
        </div>
    );

}

export default InitiatedVideoCall;