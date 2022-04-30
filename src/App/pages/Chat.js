import React from 'react'
import Chats from "../components/Chat"
export default function Chat({ type }) {
    return (
        <div>
            <Chats type={type} />
        </div>
    )
}
