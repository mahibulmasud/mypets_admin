import React, { useEffect, useState, useRef } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import "./index.css"
import Chat from "twilio-chat"
import axios from 'axios'
import { retrievedFromJwt } from '../../../utils/user-infos'
import ChatField from './ChatField'
import Contacts from './Contacts'
export default ({ type }) => {


    const [client, setClient] = useState(null);
    const [modal, setModal] = useState(false);
    const [current, setCurrent] = useState(null);
    const [date, setDate] = useState(Date.now())
    const [channels, setChannels] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [lastRead, setLastRead] = useState({});
    const [messageObject, setMessageObject] = useState({});
    const [messages, setMessages] = useState([]);
    const [mloading, setmLoading] = useState(false);
    const [cloading, setCLoading] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [incoming, setIncoming] = useState(null);
    const [fselected, setFselected] = useState(1);
    const [selected, setSelected] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [firstTime, setFirstTime] = useState(true);
    const [currentUsername, setCurrentUsername] = useState("");
    const [currentRead, setCurrentRead] = useState(-1);
    const [time, setTime] = useState(Date.now());

    const myStateRef = useRef(contacts);

    useEffect(() => {
        myStateRef.current = contacts;
    }, [contacts])

    useEffect(() => {
        initialiseTwillio()
        if (window !== undefined) {
            if (window.innerWidth < 748) {
                setIsMobile(true);
            }
        }
    }, []);


    useEffect(() => {
        if (current !== null) {
            localStorage.setItem("user", current.name);
            let obj = { username: current.username, name: current.name, channel: current.channel.uniqueName, avatar: current.avatar };
            localStorage.setItem("current", JSON.stringify(obj));
            if (messageObject[current.name] !== undefined) {
                setMessages(messageObject[current.name])
            }
            setCurrentUsername(current.name)
            console.log(messageObject[current.name], { current })
        }

    }, [current])
    const authTokens = localStorage.getItem("token")

    useEffect(() => {

        let user = retrievedFromJwt(authTokens);
        if (client !== null) {
            console.log("initialised client", { client })
            client.on("tokenAboutToExpire", async () => {
                const res = await getToken(user.email);
                const { token } = res.data;
                client.updateToken(token);
            });
            client.on("tokenExpired", async () => {
                const res = await getToken(user.email);
                const { token } = res.data;
                client.updateToken(token);
            });
        }
        fetchChannels();

    }, [client])





    const initialiseTwillio = async () => {
        try {

            let user = retrievedFromJwt(authTokens);
            const res = await getToken("Team-MyPetsLife");
            const { token } = res.data;
            console.log({ token, Chat })
            const client = await Chat.create(token)
            setClient(client)
        }
        catch (e) {
            console.log(e)
        }
    }



    const getToken = (email) => {
        return axios.get(`${process.env.REACT_APP_API_URL}/message/token`, {
            params: {
                email
            }
        });

    }




    const getVal = async (channel) => {
        console.log("getting val")
        try {

            let username = channel.channelState.friendlyName;
            let obj = { name: channel.channelState.friendlyName, username: "", avatar: "", channel };
            console.log({ obj, channel });
            let tmpContact = contacts;

            let ind = contacts.findIndex(val => {
                return val.name === obj.name
            })
            if (ind < 0) {
                if (channel.attributes.platform == type) {
                    tmpContact.push(obj);
                    setContacts(tmpContact);
                }
            }
            if (current == null && selected != null && channel.attributes.platform == type) {
                setCurrent(obj);
                let message_array = await channel.getMessages();
                console.log({ message_array, channel })
                let object = messageObject;
                object[username] = message_array.items;
                setMessageObject(object);
                setMessages(message_array.items);
                channel.on('messageAdded', (val) => {
                    console.log({ val })
                    seeMessage(val, username)
                });
                setmLoading(false);
                let element = document.getElementById("chat-box");
                if (element != null) {
                    element.scrollTop = element.scrollHeight;
                }
            }
            else {
                let message_array = await channel.getMessages();
                console.log({ message_array, username })
                let object = messageObject;
                object[username] = message_array.items;
                let templastRead = lastRead;
                templastRead[username] = new Date(Date.now()).getTime();
                setLastRead(templastRead)
                setMessageObject(object)
                setDate(Date.now())
                channel.on('messageAdded', (val) => {

                    seeMessage(val, username)
                });
                channel.on("updated", (val) => {
                    let current = localStorage.getItem("current") ? JSON.parse(localStorage.getItem("current")) : false;
                    console.log({ val, current })
                    if (current) {

                        if (val.channel.uniqueName == current.channel) {
                            let currentChannel = current;
                            currentChannel.channel = val.channel;
                            // console.log({ attribute: val.channel.attributes }, "from here")
                            // console.log(val.channel.attributes["user-read"], "frybr");
                            let index = val.channel.attributes[type === "user" ? "user-read" : "association-read"] ? val.channel.attributes[type === "user" ? "user-read" : "association-read"] : -1;
                            console.log({ index })
                            let currentRead = localStorage.getItem("current-read") ? localStorage.getItem("current-read") : -1;
                            // console.log({ index, currentRead, b: parseInt(currentRead) < index })
                            if (parseInt(currentRead) <= index) {
                                localStorage.setItem("current-read", index);
                                setCurrentRead(index);
                            }
                            // setCurrent(currentChannel);
                        }
                    }
                })
            }
        }
        catch (e) {
            console.log(e);
        }

    }

    const changeContact = (tcontacts, temp = false) => {
        console.log("%c calling setcontact", "color:red")
        let tempContact = tcontacts.sort((a, b) => {
            let first = a.channel;
            let second = b.channel;
            let flastMessageArray = messageObject[first.channelState.friendlyName] ? messageObject[first.channelState.friendlyName] : [];
            let slastMessageArray = messageObject[second.channelState.friendlyName] ? messageObject[second.channelState.friendlyName] : [];
            if ((flastMessageArray.length > 0 && slastMessageArray.length > 0) || (temp && first.lastMessage && second.lastMessage)) {
                let flastMessage = temp ? first.lastMessage.dateCreated : flastMessageArray[flastMessageArray.length - 1].dateUpdated;
                let slastMessage = temp ? second.lastMessage.dateCreated : slastMessageArray[slastMessageArray.length - 1].dateUpdated;
                let firstTime = new Date(flastMessage).getTime();
                let secondTime = new Date(slastMessage).getTime();
                // console.log({ first: first.channelState.friendlyName, second: second.channelState.friendlyName, flastMessage, slastMessage })
                if (!temp) {
                    console.log({ first: flastMessageArray[flastMessageArray.length - 1], second: slastMessageArray[slastMessageArray.length - 1] }, "from inside")
                }
                return secondTime - firstTime;

            }

            else {
                console.log("called")
                return 1;
            }
        })
        // console.log({ tempContact });
        let tmparray = tempContact.filter(() => true);
        setContacts(tmparray)
        setTime(Date.now())
    }

    useEffect(() => {

        if (firstTime && contacts.length > 0) {
            changeContact(contacts, true);
            setFirstTime(false)
        }
    }, [contacts.length, messageObject])

    useEffect(() => {
        if (current) {
            if (current.channel.lastMessage) {
                current.channel.updateLastConsumedMessageIndex(current.channel.lastMessage.index)
            }
            console.log("changed")
        }
        console.log({ selected, current });
    }, [selected])

    const seeMessage = (val, username) => {

        setIncoming(`${username}${val.dateUpdated}`);
        let msg = messageObject[username] !== undefined && messageObject[username] !== null ? messageObject[username] : [];
        if (msg.length <= 0 || (msg.length > 0 && val.dateUpdated !== msg[msg.length - 1].dateUpdated)) {
            msg.push(val);
            if (localStorage.getItem('user') === username) {
                setMessages(msg);
                setDate(Date.now())
                let element = document.getElementById("chat-box");
                if (element != null) {
                    element.scrollTop = element.scrollHeight;
                }
                let templastRead = lastRead;
                templastRead[username] = new Date(val.dateUpdated).getTime();
                setLastRead(templastRead);
            }
            let object = messageObject;
            object[username] = msg;
            setMessageObject(object);
        }

    }




    const fetchChannels = async () => {
        try {
            setCLoading(true);
            if (client !== null) {
                const channels = await client.getSubscribedChannels();
                console.log({ channels })
                if (channels.items.length > 0) {
                    for (let x in channels.items) {
                        let channel = channels.items[x];
                        console.log({ channel })
                        getVal(channel);

                    }
                }

            }
            setCLoading(false);
        }
        catch (e) {
            console.log(e);
            setCLoading(false);
        }
    }

    const AddButton = (props) => <div onClick={props.onClick} style={{ height: 60, width: 60, backgroundColor: "#13E2BA" }} className="add-button round shadow text-white row no-gutters align-items-center justify-content-center h1">
        <i class="fa fa-plus" aria-hidden="true"></i>
    </div>


    const text = "Lorem Ipsum   Lorem ipsum dolor sit amet, consectetur adipiscing elit.Sed non risus.Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.Cras elementum ultrices diam.Maecenas ligula massa, varius a, semper congue, euismod non, mi.Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.Duis semper.Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim.Pellentesque congue., "
    return (
        <>

            <div className="full-page-w-nav " style={{ backgroundColor: "white" }}>
                <div className="healthbook-bg" style={{ backgroundColor: "white", top: 0 }} />
                <Container fluid className="pt-3 " style={{ marginTop: 10, height: "calc(100vh - 72px)" }}>
                    <Row noGutters className="h-100">

                        {
                            isMobile ? current === null ? <Col md={4} className="h-100 overflow-auto" style={{ position: "relative" }}>

                                <Contacts
                                    isMobile={isMobile}
                                    lastRead={lastRead}
                                    incoming={incoming}
                                    selected={fselected}
                                    cloading={cloading}
                                    length={messages.length}
                                    current={current}
                                    contacts={contacts}
                                    setCurrent={setCurrent}
                                    setSelected={setSelected}
                                    fselected={selected}
                                    messageObject={messageObject}
                                />
                            </Col> : <></> : <Col md={4} className="h-100 overflow-auto" style={{ position: "relative" }}>

                                    <Contacts
                                        selected={fselected}
                                        fselected={selected}
                                        isMobile={isMobile}
                                        incoming={incoming}
                                        lastRead={lastRead}
                                        cloading={cloading}
                                        length={messages.length}
                                        setSelected={setSelected}
                                        selectedChannel={selectedChannel}
                                        setSelectedChannel={setSelectedChannel}
                                        current={current}
                                        contacts={contacts}
                                        setCurrent={setCurrent}
                                        messageObject={messageObject}
                                    />
                                </Col>
                        }
                        {
                            isMobile ? current !== null ? <Col md={8} className="h-100 ">
                                <div className="h-100">
                                    <ChatField type={type} fluid fetchChannels={fetchChannels} currentUsername={currentUsername} messages={messages} date={date} current={current} selected />
                                </div>
                            </Col> : <></> : <Col md={8} className="h-100 ">
                                    <Container className="h-100">
                                        <ChatField type={type} fetchChannels={fetchChannels} currentRead={currentRead} currentUsername={currentUsername} selected={selected} messages={messages} date={date} current={current} />
                                    </Container>
                                </Col>
                        }

                    </Row>
                </Container>
            </div>
        </>
    )
}