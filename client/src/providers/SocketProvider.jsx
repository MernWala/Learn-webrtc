import React, { useMemo } from 'react'
import { io } from "socket.io-client"

const SocketContext = React.createContext()
export const useSocket = () => React.useContext(SocketContext)

const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io("http://192.168.158.41:8001"), [])

    return (
        <SocketContext.Provider value={{
            socket
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider