import React, { useState, useEffect, useRef } from 'react'
import { Col, Row } from 'react-bootstrap'

const ChatTool = ({ channel, currentUser }) => {
    const [msg, setMessage] = useState("");

    const myStateRef = useRef(channel);

    const sendMessage = async (val, chan = false) => {
        try {
            console.log({ val, chan });
            if (chan) {
                await myStateRef.current.sendMessage(val);
            }
            else {
                await channel.sendMessage(val);
            }
            setMessage("")
        }
        catch (e) {
            console.log({ e })
        }
    }

    useEffect(() => {
        console.log(`%c ${currentUser}`, "color:red")
        myStateRef.current = channel;
    }, [currentUser])


    useEffect(() => {
        if (window) {
            window.addEventListener("keydown", handleFindUserEvent)
        }

        return () => {
            window.removeEventListener("keydown", handleFindUserEvent)
        }
    }, [])


    const handleFindUserEvent = (e) => {
        let inp = document.getElementById("searchbox-user-input");
        let value = inp.value;
        if (e.keyCode == 13 && value) {
            sendMessage(value, true);
        }
    }

    return <Row noGutters className="chat-tool align-items-center w-100 p-2" >
        <Col md={10} xs={9} className="h-100">
            <input id="searchbox-user-input" value={msg} onChange={(e) => { setMessage(e.target.value) }} placeholder="Écrivez votre message ici..." className="shadow rounded" />
        </Col>
        <Col md={2} xs={3}>
            <span style={{ margin: " 0 10px" }}><label for="file_input" className="mb-0"><i class="fa fa-paperclip" aria-hidden="true"></i></label></span>
            <span ><i onClick={() => sendMessage(msg)} class="fa fa-paper-plane" style={{ color: "#EC1D45" }} aria-hidden="true"></i></span>
            <input id="file_input" type="file" onChange={(e) => {
                let file = e.target.files[0];
                console.log({ val: file })
                const formData = new FormData();
                formData.append('file', file);
                sendMessage(formData);
            }} accept="image/*" style={{ display: "none" }} />
        </Col>
    </Row>
}
export default ChatTool;