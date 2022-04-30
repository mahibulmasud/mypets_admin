import React, { useEffect, useRef, useState } from "react";
import Popup from "../../components/Popup/Popup";
import { Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { decryptData, retrievedFromJwt } from "../../../utils/user-infos";
import randomString from "randomstring"



export default function PopupAddUser(props) {


    const { t } = useTranslation();
    const [nameValue, setNameValue] = useState("")
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [mloading, setMloading] = useState(false);
    const { client } = props;
    const authTokens = localStorage.getItem("token")

    useEffect(() => {
        if (window) {
            console.log("adding event listener")
            window.addEventListener("keydown", handleFindUserEvent)
        }

        return () => {
            console.log("cleanup code", { window })
            window.removeEventListener("keydown", handleFindUserEvent)
            console.log("called");
        }
    }, [])


    const handleFindUserEvent = (e) => {
        let inp = document.getElementById("searchbox-user-asso");
        let value = inp.value;
        if (e.keyCode == 13 && value) {
            findUser(value)
        }
    }

    const checkAlready = async (value) => {
        let val = new Promise(async (resolve, reject) => {
            let flag = false;
            try {
                const channels = await client.getSubscribedChannels();
                if (channels.items.length > 0) {
                    for (let x in channels.items) {
                        let channel = channels.items[x];
                        if (channel.attributes.user == value) {
                            flag = true;
                        }

                    }
                }
                resolve(flag);
            }
            catch (e) {
                console.log({ e });
                reject(e);
            }
        })
        return val;
    }

    const createChannel = async (user) => {
        try {
            if (client !== null) {
                let val = await checkAlready(user.email);
                console.log({ val });
                if (val) {
                    alert("Contact Already added")
                }
                else {
                    setMloading(true);
                    const pUser = retrievedFromJwt(authTokens)
                    console.log({ pUser })
                    let rand = randomString.generate(12);
                    const newChannel = await client
                        .createChannel({
                            uniqueName: `${rand}`,
                            friendlyName: `${user.fullName}-${pUser.name}`,
                            attributes: {
                                user: user.email,
                                association: pUser.email
                            },
                            isPrivate: true
                        });
                    await newChannel.join();
                    await newChannel.invite(user.email);
                    newChannel.on('messageAdded', (val) => {
                        console.log({ val })
                        props.seeMessage(val, user.email)
                    });
                    props.onClosed()
                    props.fetchChannels()
                }
            }
            else {
                alert("No channel")
            }
            setMloading(false);

        }
        catch (e) {
            setMloading(false);
            console.log(e);

        }
    }

    const findUser = async (val) => {
        try {

            console.log({ val })
            if (val) {
                setLoading(true);
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/findByEmail`, {
                    params: {
                        email: val
                    }
                })
                let token = res.data.token;
                let user = decryptData(token, process.env.REACT_APP_TOKEN_SECRET).findUser;
                setUsers(user);
                setLoading(false);
            }
        }
        catch (e) {
            setLoading(false);
            setUsers("no")
            console.log(e);
        }
    }



    const popupContent =
        <div className="healthbook-popup-edit">
            <Container>
                <div>
                    <>
                        <h2 className="color-green font-weight-bolder text-center healthbook-popup-edit-title">Envoyer un message</h2>
                        <div className="color-red healthbook-popup-edit-subtitle">Recherche d’utilisateur</div>
                    </>
                </div>
                <div className="healthbook-popup-body">

                    <Row>
                        <Col lg={12}>
                            <div className="healthbook-popup-edit-input-container">
                                <i className="fas fa-user healthbook-popup-edit-icon color-gradiant-red" />
                                <input className="healthbook-popup-edit-input-field font-2"
                                    id="searchbox-user-asso"
                                    type="text"
                                    placeholder={"user@gmail.com"}
                                    value={(nameValue) ? (nameValue) : ""}
                                    spellCheck={false}
                                    onChange={(event) => setNameValue(event.target.value)} />
                            </div>
                        </Col>
                        <Col lg={12} className="mt-2 w-100">
                            {
                                loading ? <Row noGutters className="justify-content-center">
                                    <Spinner animation="grow" size="sm" />
                                    <Spinner animation="grow" size="sm" />
                                    <Spinner animation="grow" size="sm" />
                                </Row> : users !== null ? users !== "no" ?
                                    users.map(user => <Row className="w-100">
                                        <Col sm={2}>
                                            <img src={user.avatar} style={{ height: 50, width: 50 }} className="round" />
                                        </Col>
                                        <Col sm={8}>
                                            <label>{user.fullName}</label><br />
                                            <label>{user.email}</label>
                                        </Col>
                                        <Col sm={2}>
                                            <div className="btn-mpl-primary" onClick={() => createChannel(user)}>{mloading ? <span><Spinner className="ml-1" size="sm" animation="border" /></span> : "Go"}</div>
                                        </Col>
                                    </Row>)
                                    :
                                    <h5 className="text-center">No User Found !</h5> : ""
                            }
                        </Col>

                    </Row>
                </div>
                <div className="text-center">
                    <div className="btn-mpl-alert healthbook-popup-edit-btn"
                        onClick={() => findUser(nameValue)}>
                        Rechercher
                    </div>
                </div>
            </Container>
        </div>;




    return (
        <Popup
            content={popupContent}
            popupHeight={'fit-content'}
            popupWidth={'35%'}
            onClosed={props.onClosed}
            minWidth={false}
        />
    )
}
