import React, { useCallback, useState } from 'react'
import { useSocket } from '../providers/SocketProvider'
import { usePeer } from '../providers/Peer'
import { useEffect } from 'react'
import ReactPlayer from 'react-player'

const Room = () => {

    const { socket } = useSocket();
    const { peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream } = usePeer()

    const [remoteEmailId, setRemoteEmailId] = useState(null)

    const handleNewUserJoined = useCallback(async ({ emailId }) => {
        console.log(`New User Joined: ${emailId}`);
        const offer = await createOffer()
        socket.emit('call-user', { emailId, offer })
        setRemoteEmailId(emailId)
    }, [createOffer, socket])

    const handleIncommingCall = useCallback(async (data) => {
        const { from, offer } = data
        const ans = await createAnswer(offer)
        socket.emit('call-accepted', { emailId: from, ans })
        setRemoteEmailId(from)
    }, [createAnswer, socket])

    const handleCallAccepted = useCallback(async (data) => {
        const { ans } = data
        await setRemoteAnswer(ans)
    }, [setRemoteAnswer])

    useEffect(() => {
        socket.on('user-joined', handleNewUserJoined)
        socket.on('incomming-call', handleIncommingCall)
        socket.on('call-accepted', handleCallAccepted);

        // return () => {
        //     socket.off('user-joined', handleNewUserJoined)
        //     socket.off('incomming-call', handleIncommingCall)
        //     socket.off('call-accepted', handleCallAccepted);
        // }
    }, [socket, handleNewUserJoined, handleIncommingCall, handleCallAccepted])

    const handleNegotiation = useCallback(async () => {
        const localOffer = await createOffer()
        socket.emit('call-user', { emailId: remoteEmailId, offer: localOffer })
    }, [remoteEmailId, socket])

    useEffect(() => {
        peer.addEventListener('negotiationneeded', handleNegotiation)

        return () => {
            peer.removeEventListener('negotiationneeded', handleNegotiation)
        }
    }, [peer, handleNegotiation])

    const [myStream, setMyStream] = useState(null)
    const getUsermediaStream = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setMyStream(stream)
    }, [])

    useEffect(() => {
        getUsermediaStream()
    }, [getUsermediaStream])

    return (
        <>
            <h1>Room</h1>
            <p><strong>You are connected to {remoteEmailId}</strong></p>

            <button type="button" onClick={(e) => sendStream(myStream)}>Send My Video</button>
            <ReactPlayer url={myStream} playing muted />
            <ReactPlayer url={remoteStream} playing muted />
        </>
    )
}

export default Room