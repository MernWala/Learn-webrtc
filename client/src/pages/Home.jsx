import React, { useCallback, useEffect } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useSocket } from "../providers/SocketProvider"
import { useCommonProvider } from "../providers/CommonProvider";
import { useState } from "react";
import { useNavigate } from "react-router-dom"

const Home = () => {

    const { socket } = useSocket();

    const [formState, setFormState] = useState(null)
    const { handleOnChange } = useCommonProvider()
    const navigate = useNavigate()

    const handleJoinRoom = useCallback((e) => {
        e.preventDefault()
        socket.emit("join-room", formState)
    }, [socket, formState])

    const handleRoomJoined = useCallback(({ roomId }) => {
        navigate(`/room/${roomId}`)
    }, [navigate])

    useEffect(() => {
        socket.on("joined-room", handleRoomJoined)
        
        return () => {
            socket.off("joined-room", handleRoomJoined)
        }
    }, [socket, handleRoomJoined])

    return (
        <React.Fragment>
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <div className="col-lg-4 col-md-6 col-12 border bg-body-tertiary p-5 rounded shadow-sm">
                    <Form className="d-flex flex-column" onSubmit={handleJoinRoom}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="email" name="emailId" placeholder="Enter email" onChange={(e) => handleOnChange(e, setFormState)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="number" name="roomId" placeholder="Enter Room" onChange={(e) => handleOnChange(e, setFormState)} />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mx-auto"> Submit </Button>
                    </Form>
                </div>
            </div>

        </React.Fragment>
    )
}

export default Home