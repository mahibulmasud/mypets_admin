import React from 'react'
import { Row } from 'react-bootstrap'


const ChatContainer = ({ type, text, time, seen }) => <Row noGutters className={(type == "sent") ? "justify-content-end mb-2" : "justify-content-start mb-2"} >
    <div className={`${type} chat-box rounded p-3`}>
        <div>{text}</div>
        <Row noGutters className="w-100 justify-content-end align-items-center">{seen && <span style={{ color: "#EC1D45", fontWeight: "bolder", fontSize: 16 }} className="mr-1">Vu</span>}{time}</Row>
        {/* {seen && <Row className="w-100 justify-content-end">Seen</Row>} */}
    </div>
</Row>

export default ChatContainer;