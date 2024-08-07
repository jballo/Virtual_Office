import React, { useEffect, useRef, useCallback, useState } from 'react';
import Peer from 'simple-peer';


function InitiatedVideoCall ({ mySocketId, myStream, othersSocketId, webrtcSocket }) {
    const peerRef = useRef();

    const createPeer = useCallback((othersSocketId, mySocketId, myStream, webrtcSocket) => {
        const peer = new Peer({
            initiator: true,
            stream: myStream,
            trickle: false,
        });

        peer.on('signal', signal => {
            webrtcSocket.emit('sendOffer', {
                callToUserSocketId: othersSocketId,
                callFromUserSocketId: mySocketId,
                offerSignal: signal,
            });
        });

        return peer;
    }, []);

    useEffect(() => {
        peerRef.current = createPeer(othersSocketId, mySocketId, myStream, webrtcSocket);
    }, [mySocketId, myStream, othersSocketId, webrtcSocket]);

    return <></>;

}

export default InitiatedVideoCall;