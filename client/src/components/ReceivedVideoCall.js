import React, { useCallback, useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';


function ReceivedVideoCall({ mySocketId, myStream, othersSocketId, webrtcSocket, offerSignal }) {
    const peerRef = useRef();
    const myVideoRef = useRef();
    const peerVideoRef = useRef();
    const [othersStream, setOthersStream] = useState();


    const createPeer = useCallback(( othersSocketId, mySocketId, myStream, webrtcSocket, offerSignal ) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: myStream,
        });

        peer.on('signal', signal => {
            console.log('sending answer from ', mySocketId, 'to ', othersSocketId);
            webrtcSocket.emit('sendAnswer', {callFromUserSocketId: othersSocketId, callToUserSocketId: mySocketId, answerSignal: signal });
        });

        peer.on('stream', stream => {
            if (peerVideoRef.current) {
                peerVideoRef.current.srcObject = stream;
            }
        })
        
        peer.signal(offerSignal);

        return peer;
        
    }, []);
    
    useEffect(() => {
        peerRef.current = createPeer(othersSocketId, mySocketId, myStream, webrtcSocket, offerSignal);

        if (myVideoRef.current) {
            myVideoRef.current.srcObject = myStream;
        }

    }, [mySocketId, myStream, othersSocketId, webrtcSocket]);

    return (
        <div>
            <video ref={myVideoRef} autoPlay muted />
            <video ref={peerVideoRef} autoPlay />
        </div>
    );
}


export default ReceivedVideoCall;