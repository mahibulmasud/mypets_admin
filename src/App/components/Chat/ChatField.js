import React, { useEffect, useState } from 'react'
import { Spinner, Row, Button } from 'react-bootstrap';
import ChatContainer from './ChatContainer'
import ChatTool from './ChatTool'
import { retrievedFromJwt } from '../../../utils/user-infos';


const ChatField = React.memo(({ messages, current, date, currentRead, currentUsername, fetchChannels, type }) => {

    const [status, setStatus] = useState("loading");
    const [imageObject, setImageObject] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [tmessages, setTmessages] = useState([]);
    const [read, setRead] = useState(currentRead);
    const authTokens = localStorage.getItem("token");

    useEffect(() => {
        if (current !== null) {
            console.log({ current, attributes: current.channel.attributes }, "changed")
            const { channelState } = current.channel;
            setRead(current.channel.attributes[type === "user" ? "user-read" : "association-read"] ? current.channel.attributes[type === "user" ? "user-read" : "association-read"] : currentRead)
            setStatus(channelState.status);
        }
        else {
            setStatus("no chats")
        }

    }, [current, date])

    const acceptInvitation = async () => {
        try {
            setStatus("loading");
            await current.channel.join();
            fetchChannels();

        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        let object = {};
        for (let x of messages) {
            let date = new Date(x.dateUpdated.toISOString());
            let datestr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            if (object[datestr] == undefined) {
                object[datestr] = [];
            }
            object[datestr].push(x);
        }
        setTmessages(object);
        console.log({ object, current })
    }, [current, date, messages])

    useEffect(() => {
        const user = retrievedFromJwt(authTokens);
        setCurrentUser(user);
    }, [])


    const changeUrl = (url, index) => {
        let imgObject = imageObject;
        imgObject[`image_${index}`] = url;
        setImageObject(imgObject)

    }

    useEffect(() => {
        let element = document.getElementById("chat-box");
        console.log({ element })
        if (element != null) {
            console.log(element.scrollHeight)
            element.scrollTop = element.scrollHeight;
        }

    }, [status, messages])

    const text = "Lorem Ipsum   Lorem ipsum dolor sit amet, consectetur adipiscing elit.Sed non risus.Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.Cras elementum ultrices diam.Maecenas ligula massa, varius a, semper congue, euismod non, mi.Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.Duis semper.Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim.Pellentesque congue., "


    const renderMain = () => {
        switch (status) {
            case "loading":
                return <Row noGutters className="h-100 justify-content-center align-items-center"><Spinner animation="border" size="lg" /></Row>
            case "no chats":
                return <></>
            case "invited":
                return <Row noGutters className="h-100 justify-content-center align-items-center">

                    <Button onClick={acceptInvitation} variant="primary"> Start Conversation</Button>
                </Row>
            default:
                return <div className="h-100">
                    {
                        Object.keys(tmessages).map(val => {
                            return <>
                                <Row noGutters className="p-2 justify-content-center align-items-center w-100">
                                    <span >{val}</span>
                                </Row>

                                {tmessages[val].length > 0 ? tmessages[val].map((message, index) => {
                                    let sent = currentUser !== null ? "Team-MyPetsLife" === message.author : false

                                    let seen = false;
                                    if (message.type == "media") {
                                        if (imageObject[`image_${index}`] == undefined) {
                                            message.media.getContentTemporaryUrl().then((val) => { changeUrl(val, index) });
                                        }
                                        return <img className="message-image" src={imageObject[`image_${index}`]} />

                                    }
                                    else {
                                        if (sent) {
                                            if (current.channel) {
                                                let index = currentRead;
                                                console.log({ currentRead, index, message })
                                                if (index !== undefined && index !== null) {
                                                    if (message.index <= index) {
                                                        seen = true;
                                                    }
                                                }
                                            }
                                        }
                                        return (<ChatContainer read={read} seen={seen} key={`message_${index}`} type={sent ? "sent" : "recieved"} text={message.body} time={`${new Date(message.dateUpdated.toISOString()).getHours()}:${new Date(message.dateUpdated.toISOString()).getMinutes()}`} />)
                                    }
                                }) : "Be the first to message"}

                            </>
                        })
                    }
                </div>
        }
    }

    return <>
        <div className="w-100  p-2 overflow-auto" id="chat-box" style={{ height: "calc(100% - 70px)" }}>
            {
                renderMain(status)
            }
        </div>
        {
            status !== "loading" && status !== "no chats" &&

            <ChatTool currentUser={currentUsername} channel={current !== null ? current.channel : null} />
        }
    </>
})

export default ChatField;