// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import { Col, Row } from 'react-bootstrap'


// const ContactContainer = ({ index, selected, setSelected, setCurrent, last_message, user, count, current }) => {

//     const [avatar, setAvatar] = useState(null);
//     const [name, setName] = useState("")

//     const fetchAvatar = async (val) => {
//         try {
//             const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/avatar?email=${val}`);
//             console.log({ data: res.data });
//             setAvatar(res.data.user.avatar);
//         }
//         catch (e) {
//             console.log({ e })
//         }
//     }

//     useEffect(() => {
//         if (user.channel) {
//             if (user.channel.channelState.attributes) {
//                 fetchAvatar(user.channel.channelState.attributes.association)
//             }
//             if (user.channel.channelState.attributes.pet) {
//                 setName(user.name);
//             }
//             else {
//                 setName(user.name.split("-")[1])
//             }
//         }
//     }, [count])

//     return (<Row onClick={() => {

//         setCurrent(user);
//         setSelected(index);
//         if (current) {
//             console.log("updating", { current })
//             if (current.channel.lastMessage) {
//                 current.channel.updateLastConsumedMessageIndex(current.channel.lastMessage.index);
//             }
//         }


//     }} className=" contact-container align-items-center w-100 p-1" noGutters style={{ backgroundColor: (selected) ? "#C2F3EC" : "inherit" }}>
//         <Col xs={3} >
//             <div style={{ position: "relative" }}>{(count !== undefined && count) > 0 ? <span
//                 style={{
//                     position: "absolute", zIndex: 3, top: -1, right: 2, width: 25, height: 25,
//                     display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "50%", backgroundColor: "#048ab3", color: "white"
//                 }}>{count > 0 ? count : ""}</span> : ""}<img src={avatar ? avatar : ""} /></div>
//         </Col>
//         <Col xs={9} className="row no-gutters justify-content-center flex-column">
//             <h3>
//                 {name}
//             </h3>
//             <h5>
//                 {last_message ? last_message.length > 30 ? last_message.substr(0, 30) : last_message : ""}
//             </h5>
//         </Col>
//     </Row>)
// }
// export default ContactContainer;
import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { Col, Row } from 'react-bootstrap'


const ContactContainer = ({ index, selected, setSelected, setCurrent, last_message, user, count, current, lastReadTime, setSelectedChannel }) => {

    const [avatar, setAvatar] = useState(null);
    const [name, setName] = useState("");
    const [lastRead, setLastRead] = useState(null);

    const myStateRef = useRef(lastReadTime);


    useEffect(() => {
        myStateRef.current = lastReadTime;
    }, [lastReadTime])
    const calculateDifference = () => {
        let first = new Date().getTime();
        let second = myStateRef.current;
        if (second) {
            let date = (first - second) / (60 * 60 * 24 * 1000);
            let hour = (first - second) / (60 * 60 * 1000);
            let minute = (first - second) / (60 * 1000);
            let seconds = (first - second) / 1000;
            let tempLast = date < 1 ? hour < 1 ? minute < 1 ? `Il y a quelques secondes` : `Il y a ${parseInt(minute)} minutes` : `il y a ${parseInt(hour)} heures` : `il y a ${parseInt(date)} jours`;
            setLastRead(tempLast);
        }
        else {
            setLastRead("")
        }
    }

    useEffect(() => {
        if (window) {
            let val = window.setInterval(calculateDifference, '1000');
            return () => window.clearInterval(val);
        }

    }, [])

    const fetchAvatar = async (val) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/avatar?email=${val}`);
            // console.log({ data: res.data });
            setAvatar(res.data.user.avatar);
        }
        catch (e) {
            console.log({ e })
        }
    }

    useEffect(() => {
        if (user.channel) {
            if (user.channel.channelState.attributes) {
                fetchAvatar(user.channel.channelState.attributes.user)
            }
            if (user.channel.channelState.attributes.pet) {
                // console.log("hello")
                setName(user.name);

            }
            else {
                setName(user.name.split("-")[0])
            }
        }
    }, [count])

    return (<Row onClick={() => {

        setCurrent(user);
        if (user.channel) {
            setSelectedChannel(user.channel.uniqueName);
        }
        if (current) {
            // console.log("updating", { current })
            if (current.channel.lastMessage) {
                current.channel.updateLastConsumedMessageIndex(current.channel.lastMessage.index);

            }
        }
    }} className=" contact-container align-items-center w-100 p-1" noGutters style={{ backgroundColor: (selected) ? "#C2F3EC" : "inherit" }}>
        <Col xs={3} >
            <div style={{ position: "relative" }}>{(count !== undefined && count) > 0 ? <span
                style={{
                    position: "absolute", zIndex: 3, top: -1, right: 12, width: 20, height: 20,
                    display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "50%", backgroundColor: "#13E2BA", color: "white"
                }}>{count > 0 ? count : ""}</span> : ""}<img src={avatar ? avatar : ""} /></div>
        </Col>
        <Col xs={9} className="row no-gutters justify-content-center flex-column">
            <h3>
                {name}
            </h3>
            <h5 style={{ color: count > 0 ? "red" : "#212529" }}>
                {/* {last_message ? last_message.length > 30 ? last_message.substr(0, 30) : last_message : ""} */}
                {lastRead}
            </h5>
            <span style={{ fontSize: 10 }}>{ }</span>
        </Col>
    </Row>)
}
export default ContactContainer;