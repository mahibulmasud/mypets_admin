import axios from 'axios';
import React, { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap';
import PopupEditProfilePicture from './PopupEditProfilePicture/PopupEditProfilePicture';
import SearchLocationInput from './SearchLocationInput';


export default function EditUserComponent(props) {

    const changeToForm = val => {
        let converted = ""
        if (val) {
            let date = new Date(val);
            converted = `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? "0" : ""}${date.getMonth() + 1}-${(date.getDate()) < 10 ? "0" : ""}${date.getDate()}`
        }
        return converted;
    }

    const { subscriptionType, active } = props.user;


    const [firstName, setFirstName] = useState(props.user.firstName);
    const [lastName, setLastName] = useState(props.user.lastName);
    const [email, setEmail] = useState(props.user.email);
    const [phoneNumber, setPhoneNumber] = useState(props.user.phoneNumber);
    const [address, setAddress] = useState(props.user.address);
    const [avatar, setAvatar] = useState(props.user.avatar);
    const [birthDate, setBirthDate] = useState(changeToForm(props.user.birthDate));
    const [editAvatar, setEditAvatar] = useState(false);
    const [saving, setSaving] = useState(false);

    const saveChanges = async () => {
        try {
            setSaving(true);
            let user = { id: props.user._id, firstName, lastName, email, phoneNumber, address, avatar, birthDate };
            await axios.put(`${process.env.REACT_APP_BURL}/admin/edituser`, { user });
            setSaving(false);
            props.fetchUsers();
        }
        catch (e) {
            console.log(e);
            setSaving(false);

        }
    }


    return (
        <div>
            {
                editAvatar && <PopupEditProfilePicture onClosed={() => setEditAvatar(false)} avatar={avatar} setAvatar={setAvatar} setEditAvatar={setEditAvatar} />
            }
            <Row>
                <Col md={12}>
                    <div className="mpl-profile-picture-overlay"
                    >
                        <div className="uploaded-image-wrapper w-100 h-100">
                            <div style={{ borderRadius: "50%" }} className="uploader" onClick={() => setEditAvatar(true)}>
                                <div className="w-100 text-center">
                                    <i className="fas fa-edit fa-4x color-gradiant-black" />
                                </div>
                            </div>
                            <img style={{ borderRadius: "50%" }} className="w-100 h-100 uploading-image" src={avatar} />
                        </div>
                    </div>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />

                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />

                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Adresse</Form.Label>
                        <SearchLocationInput value={address}
                            className={"input-edit" + (!address ? " input-edit-empty" : "")}
                            onChange={setAddress} />

                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Telephone</Form.Label>
                        <Form.Control type="number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Anniversaire</Form.Label>
                        <Form.Control type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />

                    </Form.Group>
                </Col>


            </Row>
            <Row className="mt-1 justify-content-between" noGutters>
                <Button onClick={props.setDeactivateModal} variant="warning">{active ? "Désactiver" : "Activate"} User</Button>
                <Button onClick={props.setDelModal} variant="danger">Supprimer</Button>
                <Button onClick={saving ? () => { console.log("") } : saveChanges} variant="success">{saving ? "Saving..." : "Sauvegarder"}</Button>
                <Button onClick={props.setSubModal} variant="secondary">{subscriptionType === "PREMIUM" ? " Annulation abonnement" : "Activation abonnement"}</Button>
            </Row>
        </div>
    )
}
