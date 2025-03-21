import React, { useMemo, useState, useCallback } from 'react'
import { useEffect } from 'react'

const PeerContext = React.createContext()
export const usePeer = () => React.useContext(PeerContext)

const PeerProvider = ({ children }) => {

    const peer = useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302'
            }
        ]
    }), [])

    const createOffer = async () => {
        const offer = await peer.createOffer()
        await peer.setLocalDescription(offer)
        return offer
    }

    const createAnswer = async (offer) => {
        await peer.setRemoteDescription(offer)
        const answer = await peer.createAnswer()
        await peer.setLocalDescription(answer)
        return answer
    }

    const setRemoteAnswer = async (ans) => {
        await peer.setRemoteDescription(ans);
    }

    const sendStream = async (stream) => {
        const tracks = stream.getTracks()
        for (const track of tracks) {
            peer.addTrack(track, stream)
        }
    }

    const [remoteStream, setRemoteStream] = useState(null)
    const handleTrackEvent = useCallback((event) => {
        const streams = event.streams
        setRemoteStream(streams[0])
    }, [])

    useEffect(() => {
        peer.addEventListener('track', handleTrackEvent)

        return () => {
            peer.removeEventListener('track', handleTrackEvent)
        }
    }, [handleTrackEvent, peer])

    return (
        <PeerContext.Provider value={{
            peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream
        }}>
            {children}
        </PeerContext.Provider>
    )
}

export default PeerProvider