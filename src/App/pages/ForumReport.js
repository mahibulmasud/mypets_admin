/* eslint-disable react-hooks/exhaustive-deps */

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Dropdown, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import TopicDescriptionBanner from '../components/TopicDescriptionBanner';

export default function ForumReport() {

    const categories = [{ name: "Global", value: "global" }, { name: "Chien", value: "dog" }, { name: "Chat", value: "cat" }, { name: "N.A.C", value: "nac" }, { name: "Autres", value: "other" },
    ];
    const subcategories = [{ name: "Global", value: "global" }, { name: "Santé", value: "first" }, { name: "Traitement", value: "second" }, { name: "Forme", value: "third" }, { name: "Saillie", value: "fourth" }
        , { name: "Grossesse", value: "fifth" }, { name: "Nouveauné", value: "sixth" }, { name: "Nutrition", value: "seventh" }, { name: "Avis/conseils", value: "eighth" }
    ];
    const [categorie, setCategorie] = useState(0);
    const [subcategorie, setSubCategorie] = useState(0);
    const [forums, setForums] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userModal, setUserModal] = useState(false);
    const [currentForum, setCurrentForum] = useState(null);
    const [banned, setBanned] = useState(false);
    const [banLoading, setBanLoading] = useState(false);
    const [bandetailLoading, setBanDetailLoading] = useState(false);
    const [acceptLoading, setAcceptLoading] = useState(false);

    const history = useHistory()


    const fetchForums = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_BURL}/forum/getTopics`, {
                params: {
                    category: categories[categorie].value, sub_category: subcategories[subcategorie].value, reported: true
                }
            });
            setLoading(false);
            setForums(res.data.forums);
        }
        catch (e) {
            setLoading(false);

            console.log(e)
        }
    }

    const acceptAnyway = async () => {
        try {
            setAcceptLoading(true);
            await axios.get(`${process.env.REACT_APP_BURL}/forum/removeReports?id=${currentForum._id}`);
            setAcceptLoading(false);
            setUserModal(false);
            fetchForums();
        }
        catch (e) {
            setAcceptLoading(false);
            console.log(e);
        }
    }


    const fetchBanned = async () => {
        try {
            if (currentForum != null) {
                setBanDetailLoading(true);
                let res = await axios.get(`${process.env.REACT_APP_BURL}/forum/banDetails?id=${currentForum.user_id._id}`);
                if (res.data.ban) {
                    setBanned(true);
                }
                else {
                    setBanned(false);
                }
                setBanDetailLoading(false);

            }
        }
        catch (e) {
            console.log(e);
            setBanDetailLoading(false);
        }
    }

    const banUser = async () => {
        try {
            if (currentForum != null) {
                setBanLoading(true);
                await axios.get(`${process.env.REACT_APP_BURL}/forum/banUser?id=${currentForum.user_id._id}`);
                setBanLoading(false);

            }
        }
        catch (e) {
            console.log(e);
            setBanLoading(false);
        }
    }

    const removeBan = async () => {
        try {
            if (currentForum != null) {
                setBanLoading(true);
                await axios.get(`${process.env.REACT_APP_BURL}/forum/banUser?id=${currentForum.user_id._id}`);
                setBanLoading(false);
                setUserModal(false);

            }
        }
        catch (e) {
            console.log(e);
            setBanLoading(false);
        }
    }



    useEffect(() => {
        fetchForums();
    }, [categorie, subcategorie]);

    useEffect(() => {
        fetchBanned()
    }, [userModal])

    return (
        <div>
            <Modal size="lg" show={userModal} onHide={() => setUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Forum Details</Modal.Title>
                </Modal.Header>
                {
                    currentForum && <div className="p-2">
                        <TopicDescriptionBanner array={[]} correct topic={currentForum.title} description={currentForum.content} date={currentForum.publication_date} user={currentForum.user_id} />
                        <div className="mt-1" >
                            <h3>Reports</h3>
                            <div style={{ maxHeight: 200, overflow: "auto" }}>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Reason</th>
                                        </tr>

                                    </thead>
                                    <tbody>
                                        {
                                            currentForum.reportedBy.map((val, i) =>
                                                <tr>
                                                    <th>{i + 1}</th>
                                                    <th>{val.reason}</th>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                        <Row className="mt-2 justify-content-between" noGutters>
                            <Button onClick={banned ? removeBan : banUser} variant="danger">{banLoading ? <Spinner size="sm" animation="border" /> : bandetailLoading ? "" : banned ? "Remove Ban" : "Ban User"}</Button>
                            <Button onClick={acceptAnyway} variant="success">{acceptLoading ? <Spinner size="sm" animation="border" /> : "Accept Anyway"}</Button>
                            <Button onClick={() => history.push(`/forum:${currentForum._id}`)} variant="secondary">More Details</Button>
                        </Row>
                    </div>
                }

                <Modal.Body>
                </Modal.Body>
            </Modal>
            <Row noGutters>
                <Dropdown >
                    <Dropdown.Toggle variant={'div'} id="dropdown-basic">
                        {`Categorie - ${categories[categorie].name}`}
                    </Dropdown.Toggle>
                    <ul>
                        <Dropdown.Menu>
                            {
                                categories.map((val, i) => <li onClick={() => setCategorie(i)}>{val.name}</li>)
                            }
                        </Dropdown.Menu>
                    </ul>
                </Dropdown>
                <Dropdown className="ml-2">
                    <Dropdown.Toggle variant={'div'} id="dropdown-basic">
                        {`Subcategorie - ${subcategories[subcategorie].name}`}
                    </Dropdown.Toggle>
                    <ul>
                        <Dropdown.Menu>
                            {
                                subcategories.map((val, i) => <li onClick={() => setSubCategorie(i)}>{val.name}</li>)
                            }
                        </Dropdown.Menu>
                    </ul>
                </Dropdown>
            </Row>
            {
                loading ? <div className="w-100 text-center h-100"><Spinner animation="border" size="lg" /></div> : forums.length > 0 ?
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Users Reported</th>
                                <th>Author</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {forums.map((val, i) => <>
                                <tr>
                                    <td>{i + 1}</td>
                                    <td>{val.title}</td>
                                    <td>{val.reportedBy.length}</td>
                                    <td>{val.user_id.firstName} {val.user_id.lastName}</td>
                                    <td><Button onClick={() => {
                                        setCurrentForum(val);
                                        setUserModal(true)
                                    }} >Details</Button></td>
                                </tr>
                            </>)}
                        </tbody>
                    </Table>
                    : <div className="w-100 h-100 row no-gutters justify-content-center align-items-center">
                        <h5>No Forums Reported</h5>
                    </div>
            }
            {/* <EditComponent /> */}
        </div>
    )
}
