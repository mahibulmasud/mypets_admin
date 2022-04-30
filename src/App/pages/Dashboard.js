import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Spinner, Modal, Button, Dropdown } from 'react-bootstrap';
import Aux from "../../hoc/_Aux";
import axios from 'axios';
import { decryptData, retrievedFromJwt } from '../../utils/user-infos';
import EditUserComponent from '../components/EditUserComponent';
import Pies from '../components/charts/Pies';
import Chart from '../components/charts';




const categories = ["Toute", "Aujourd'hui", " Hier", "Cette semaine", " Semaine dernière", "Ce mois-ci", "Ce trimestre", " Cette année"];

export default function Dashboard() {

    const [users, setUsers] = useState([]);
    const [userLoading, setUserLoading] = useState(false);
    const [forumCount, setForumCount] = useState("");
    const [blogCount, setBlogCount] = useState("");
    const [forumLoading, setForumLoading] = useState(false);
    const [blogLoading, setBlogLoading] = useState(false);
    const [categorie, setCategorie] = useState("Toute");
    const [premUser, setPremUser] = useState("");
    const [adoption, setadoption] = useState("");
    const [adoptionasking, setAdoptionasking] = useState("");
    const [deactivateModal, setDeactivateModal] = useState(false);
    const [delModal, setDelModal] = useState(false);
    const [subModal, setSubModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [userModal, setUserModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [sexListFree, setSexListFree] = useState(null);
    const [sexList, setSexList] = useState(null);
    const [sexListPremium, setSexListPremium] = useState(null);
    const [monthlyPremGraph, setMonthlyPremGraph] = useState({});
    const [weeklyGlobalGraph, setWeeklyGlobalGraph] = useState({});
    const [monthlyGlobalGraph, setMonthlyGlobalGraph] = useState({});
    const [weeklyPremGraph, setWeeklyPremGraph] = useState({});
    const [monthlyFreeGraph, setMonthlyFreeGraph] = useState({});
    const [weeklyFreeGraph, setWeeklyFreeGraph] = useState({});
    const [averageGlobal, setAverageGlobal] = useState();
    const [averagePremium, setAveragePremium] = useState();
    const [averageFree, setAverageFree] = useState();
    const [allUser, setAllUser] = useState("");
    const [countryWise, setCountryWise] = useState({});



    const RowDots = ({ name, val, color }) => <Row noGutters className="justify-content-between align-items-center  w-100" >
        <div>
            <label style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: color }} className="mb-0 mr-1"></label>
            {name}
        </div>
        <div>
            {val}
        </div>
    </Row>


    const fetchLength = (array, key) => {
        let count = 0;
        for (let x of array) {
            if (x == key | key == "global")
                count++;
        }
        return count;
    }

    const calculateWeek = (val) => {
        console.log({ val })
        let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let month = val.getMonth();
        let date = val.getDate();
        let previousDays = 0;
        for (let x in days) {
            if (x < month) {
                previousDays += days[x];
            }
            else break;
        }
        let totalDay = previousDays + date;
        return (totalDay % 7 == 0) ? totalDay / 7 : parseInt(totalDay / 7) + 1;
    }

    const token = localStorage.getItem("token");
    const user = retrievedFromJwt(token);
    useEffect(() => {
        fetchUserCount(categorie);
        fetchForumNumber(categorie);
        fetchBlogNumber(categorie);
    }, [categorie])

    useEffect(() => {

        fetchUsers();
    }, [])


    const removeWhiteSpaces = (val) => {
        let str = val;
        for (let x = 0; x < val.length; x++) {
            str = str.replace(" ", "");
        }
        return str;
    }

    const setCountry = (array) => {
        let obj = {};
        for (let x of array) {
            let address = x.address;
            if (address) {
                let addressArray = address.split(",");
                if (addressArray.length == 3) {
                    let country = addressArray[2], mainCity;
                    // let city = addressArray[1];
                    // let cityNum = city ? parseInt(city) : 0;
                    // console.log({ cityNum, city })
                    // mainCity = city.replace(cityNum.toString(), "");
                    // mainCity = removeWhiteSpaces(mainCity);
                    country = removeWhiteSpaces(country);
                    if (obj[country] == undefined || obj[country] == undefined) {
                        obj[country] = [];
                    }
                    obj[country].push(x.subscriptionType);
                }
            }
        }
        setCountryWise(obj);

    }

    const fetchWeeklyFree = (adoption) => {
        let object = {};
        for (let x in adoption) {
            let adoptionValue = adoption[x];
            let value = calculateWeek(new Date(adoptionValue.createdAt));
            let year = new Date(adoptionValue.createdAt).getFullYear();
            if (object[year] == null || object[year] == undefined) {
                object[year] = {}
            }
            if (object[year][value] == null || object[year][value] == undefined) {
                object[year][value] = 0;
            }
            object[year][value] += 1;
        }
        setWeeklyFreeGraph(object);
    }

    const fetchWeeklyGlobal = (adoption) => {
        let object = {};
        for (let x in adoption) {
            let adoptionValue = adoption[x];
            let value = calculateWeek(new Date(adoptionValue.createdAt));
            let year = new Date(adoptionValue.createdAt).getFullYear();
            if (object[year] == null || object[year] == undefined) {
                object[year] = {}
            }
            if (object[year][value] == null || object[year][value] == undefined) {
                object[year][value] = 0;
            }
            object[year][value] += 1;
        }
        setWeeklyGlobalGraph(object);
    }

    const fetchMonthlyGlobal = (adoption) => {
        let object = {};
        for (let x in adoption) {
            let adoptionValue = adoption[x];
            let year = new Date(adoptionValue.createdAt).getFullYear();
            let value = new Date(adoptionValue.createdAt).getMonth();
            if (object[year] == null || object[year] == undefined) {
                object[year] = {}
            }
            let tempobj = object[year];
            if (tempobj[value] == null || tempobj[value] == undefined) {
                object[year][value] = 0;
            }
            object[year][value] += 1;
        }
        setMonthlyGlobalGraph(object);
    }

    const fetchWeeklyPremium = (adoption) => {
        let object = {};
        for (let x in adoption) {
            let adoptionValue = adoption[x];
            let value = calculateWeek(new Date(adoptionValue.createdAt));
            let year = new Date(adoptionValue.createdAt).getFullYear();
            if (object[year] == null || object[year] == undefined) {
                object[year] = {}
            }
            if (object[year][value] == null || object[year][value] == undefined) {
                object[year][value] = 0;
            }
            object[year][value] += 1;
        }
        setWeeklyPremGraph(object);
    }

    const fetchMonthlyPremium = (adoption) => {
        let object = {};
        for (let x in adoption) {
            let adoptionValue = adoption[x];
            let year = new Date(adoptionValue.createdAt).getFullYear();
            let value = new Date(adoptionValue.createdAt).getMonth();
            if (object[year] == null || object[year] == undefined) {
                object[year] = {}
            }
            let tempobj = object[year];
            if (tempobj[value] == null || tempobj[value] == undefined) {
                object[year][value] = 0;
            }
            object[year][value] += 1;
        }
        setMonthlyPremGraph(object);
    }

    const fetchMonthlyFree = (adoption) => {
        let object = {};
        for (let x in adoption) {
            let adoptionValue = adoption[x];
            let year = new Date(adoptionValue.createdAt).getFullYear();
            let value = new Date(adoptionValue.createdAt).getMonth();
            if (object[year] == null || object[year] == undefined) {
                object[year] = {}
            }
            let tempobj = object[year];
            if (tempobj[value] == null || tempobj[value] == undefined) {
                object[year][value] = 0;
            }
            object[year][value] += 1;
        }
        setMonthlyFreeGraph(object);
    }

    const fetchAverageAge = (arr) => {
        let count = 0;
        for (let x of arr) {
            let year = x.birthDate ? new Date(x.birthDate).getFullYear() : null;
            console.log({ year })
            let age = year ? new Date(Date.now()).getFullYear() - year : 0;
            count += age;
        }
        return arr.length > 0 ? parseInt(count / arr.length) : count;

    }

    const initialiseGraph = (users) => {
        console.log({ users })
        try {
            let premiumUser = users.filter(val => val.subscriptionType == "PREMIUM");
            let freeUser = users.filter(val => val.subscriptionType == "FREE");
            let avgGlobal = fetchAverageAge(users);
            let avgPrem = fetchAverageAge(premiumUser);
            let avgFree = fetchAverageAge(freeUser);
            setAverageGlobal(avgGlobal);
            setAveragePremium(avgPrem);
            setAverageFree(avgFree);
            fetchAverageAge(users);
            fetchWeeklyGlobal(users);
            fetchMonthlyGlobal(users);
            fetchWeeklyFree(freeUser);
            fetchWeeklyPremium(premiumUser);
            fetchMonthlyPremium(premiumUser);
            fetchMonthlyFree(freeUser);
            setCountry(users);

        }
        catch (e) {
            console.log({ e });
        }
    }

    const fetchUsers = async () => {
        try {
            setUserLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_BURL}/admin/allUsers`);
            const data = decryptData(res.data.token);
            console.log(data.users, "user");
            setUsers(data.users);
            let maleCountF = 0, femaleCountF = 0, maleCountP = 0, femaleCountP = 0, maleCount = 0, femaleCount = 0;
            initialiseGraph(data.users);
            if (data.users) {
                for (let x of data.users) {
                    if (x.sex == "male") {
                        maleCount++;
                    }
                    else {
                        femaleCount++;
                    }
                    if (x.subscriptionType == "FREE") {
                        if (x.sex == "male")
                            maleCountF++;
                        else femaleCountF++;
                    }
                    else if (x.subscriptionType == "PREMIUM") {
                        if (x.sex == "male")
                            maleCountP++;
                        else femaleCountP++;
                    }
                }
            }
            setSexListFree({ male: maleCountF, female: femaleCountF });
            setSexList({ male: maleCount, female: femaleCount });
            setSexListPremium({ male: maleCountP, female: femaleCountP });
            setUserLoading(false);
        }
        catch (e) {
            setUserLoading(false);
            console.log(e)
        }
    }

    const fetchForumNumber = async (val) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BURL}/admin/forumNumber?filter=${val}`);
            setForumCount(res.data.forum);
            console.log(res.status, "forum");
        }
        catch (e) {

        }
    }


    const fetchBlogNumber = async (val) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BURL}/admin/blogNumber?filter=${val}`);
            setBlogCount(res.data.blog);
        }
        catch (e) {

        }
    }

    const fetchUserCount = async (val) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BURL}/admin/premiumUser?filter=${val}`);
            const { premium, adoption, adoptionAsking, all } = res.data;
            setAdoptionasking(adoptionAsking);
            setadoption(adoption);
            setPremUser(premium);
            setAllUser(all)
        }
        catch (e) {
            console.log(e)
        }
    }

    const handleClose = () => {
        setDeactivateModal(false);
        setDelModal(false);
    }

    const handleDeactivate = async () => {
        try {
            setModalLoading(true);
            await axios.post(`${process.env.REACT_APP_BURL}/admin/${currentUser?.active ? "deactivateuser" : "activateuser"}`, {
                id: currentUser._id
            });
            setModalLoading(false);
            setDeactivateModal(false);
            fetchUsers()
        }
        catch (e) {
            setModalLoading(false)
            console.log(e);
        }
    }
    const handleDelete = async () => {
        try {
            setModalLoading(true);
            await axios.post(`${process.env.REACT_APP_BURL}/admin/deleteuser`, {
                id: currentUser._id
            });
            setModalLoading(false)
            setDelModal(false);
            fetchUsers();
            fetchUserCount()
        }
        catch (e) {
            setModalLoading(false)
            console.log(e);
        }
    }

    const handleSubscription = async () => {
        try {
            setModalLoading(true);
            await axios.post(`${process.env.REACT_APP_BURL}/admin/${currentUser?.subscriptionType === "PREMIUM" ? "cancelsubscription" : "enablesubscription"}`, {
                id: currentUser._id
            });
            setModalLoading(false)
            setSubModal(false);
            setUserModal(false);
            fetchUsers();
            fetchUserCount();
        }
        catch (e) {
            setModalLoading(false)
            console.log(e);
        }
    }


    return (
        <Aux>
            <Modal show={deactivateModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Deactivate User</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you really want to {currentUser?.active ? "deactivate" : "activate"} {currentUser?.firstName}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleDeactivate}>
                        {modalLoading ? <Spinner animation="border" size="sm" /> : currentUser?.active ? "Deactivate" : "Activate"}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={subModal} onHide={() => setSubModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Subscription</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you really want to {currentUser?.subscriptionType === "PREMIUM" ? "cancel" : "enable"} {currentUser?.firstName}'s subscription</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSubModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubscription}>
                        {modalLoading ? <Spinner animation="border" size="sm" /> : currentUser?.subscriptionType === "PREMIUM" ? "CANCEL SUBSCRIPTION" : "ENABLE SUBSCRIPTION"}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={delModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you really want to really delete {currentUser?.firstName}?This will result in deletion of all data of the user and it cant be retrieved in future</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        {modalLoading ? <Spinner animation="border" size="sm" /> : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal size="lg" show={userModal} onHide={() => setUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier l’utilisateur</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <EditUserComponent user={currentUser} setSubModal={setSubModal} setDeactivateModal={setDeactivateModal} setDelModal={setDelModal} fetchUsers={fetchUsers} />
                </Modal.Body>
            </Modal>

            <Row noGutters>
                <Dropdown >
                    <Dropdown.Toggle variant={'div'} id="dropdown-basic">
                        {`Categorie - ${categorie}`}
                    </Dropdown.Toggle>
                    <ul>
                        <Dropdown.Menu>
                            {
                                categories.map((val, i) => <li onClick={() => setCategorie(val)}>{val}</li>)
                            }
                        </Dropdown.Menu>
                    </ul>
                </Dropdown>
            </Row>
            <Row>
                <Col md={6} xl={3}>
                    <Card>
                        <Card.Body>
                            <h6 className='mb-4'>Tous les utilisateurs</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-arrow-up text-c-green f-30 m-r-5" /> {allUser}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={3}>
                    <Card>
                        <Card.Body>
                            <h6 className='mb-4'>Utilisateurs Premium</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-arrow-up text-c-green f-30 m-r-5" /> {premUser}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={3}>
                    <Card>
                        <Card.Body>
                            <h6 className='mb-4'>Annonces créées</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-arrow-down text-c-red f-30 m-r-5" />{adoption}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3}>
                    <Card>
                        <Card.Body>
                            <h6 className='mb-4'>Demandes d'adoption</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-arrow-up text-c-green f-30 m-r-5" />{adoptionasking}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8} xl={9}>
                    <Card className='Recent-Users' style={{ maxHeight: "80vh", height: "fit-content", overflowY: "auto" }}>
                        <Card.Header>
                            <Card.Title as='h5'>Utilisateurs</Card.Title>
                        </Card.Header>
                        <Card.Body className='px-0 py-2'>
                            <Table responsive>
                                {
                                    userLoading ? <div className="w-100 text-center h-100"><Spinner animation="border" size="lg" /></div> : <tbody>
                                        {
                                            users.map(val => {
                                                if (user._id !== val._id) {
                                                    return <tr className="unread">
                                                        <td><img className="rounded-circle" style={{ width: '40px' }} src={val.avatar} alt="activity-user" /></td>
                                                        <td>
                                                            <h6 className="mb-1">{val.firstName} {val.lastName}</h6>
                                                            <p className="m-0">{val.email}</p>
                                                        </td>
                                                        <td >{(val.subscriptionType !== undefined && val.subscriptionType !== "") ? val.subscriptionType : "NOT SUBSCRIBED"}</td>
                                                        <td>
                                                            {/* <span
                                                                onClick={() => {
                                                                    setCurrentUser(val);
                                                                    setDeactivateModal(true);
                                                                }}
                                                                className="label theme-bg2 text-white f-12">{val.active ? "Deactivate" : "Activate"}</span><span onClick={() => {
                                                                    setCurrentUser(val);
                                                                    setDelModal(true);
                                                                }} className="label theme-bg text-white f-12">Delete</span> */}
                                                            <span
                                                                onClick={() => {
                                                                    setCurrentUser(val);
                                                                    setUserModal(true);
                                                                }}
                                                                className="label theme-bg2 text-white f-12">Modifier</span>
                                                        </td>
                                                    </tr>
                                                }
                                            })
                                        }
                                    </tbody>
                                }
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} xl={3}>
                    <Card>
                        <Card.Body className='border-bottom'>
                            <div className="row d-flex align-items-center">
                                <div className="col-auto">
                                    <i className="feather icon-zap f-30 text-c-green" />
                                </div>
                                <div className="col">
                                    <h3 className="f-w-300">{forumCount}</h3>
                                    <span className="d-block text-uppercase"> Forum</span>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="row d-flex align-items-center">
                                <div className="col-auto">
                                    <i className="feather icon-map-pin f-30 text-c-blue" />
                                </div>
                                <div className="col">
                                    <h3 className="f-w-300">{blogCount}</h3>
                                    <span className="d-block text-uppercase">Blogs</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <div className="shadow p-2 pt-3 round fit-content w-100 mb-4 bg-white">
                        <h5 className="text-center mb-1 text-secondary font-weight-bold">SR Global</h5>

                        <Row noGutters className="align-items-center">
                            <Pies data={sexList ? sexList : { male: 0, female: 0 }} />
                            <div className=" row flex-column justify-content-center p-1" style={{ width: "calc( 100% - 200px)" }}>
                                <RowDots name="Male" val={sexList?.male} color="#08cba5" />
                                <RowDots name="Female" val={sexList?.female} color="#ed1944" />

                            </div>
                        </Row>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="shadow p-2 pt-3 round fit-content w-100 mb-4 bg-white">
                        <h5 className="text-center mb-1 text-secondary font-weight-bold">SR Premium</h5>

                        <Row noGutters className="align-items-center">
                            <Pies data={sexListPremium ? sexListPremium : { male: 0, female: 0 }} />
                            <div className=" row flex-column justify-content-center p-1" style={{ width: "calc( 100% - 200px)" }}>
                                <RowDots name="Male" val={sexListPremium?.male} color="#08cba5" />
                                <RowDots name="Female" val={sexListPremium?.female} color="#ed1944" />

                            </div>
                        </Row>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="shadow p-2 pt-3 round fit-content w-100 mb-4 bg-white">
                        <h5 className="text-center mb-1 text-secondary font-weight-bold">SR Free</h5>

                        <Row noGutters className="align-items-center">
                            <Pies data={sexListFree ? sexListFree : { male: 0, female: 0 }} />
                            <div className=" row flex-column justify-content-center p-1" style={{ width: "calc( 100% - 200px)" }}>
                                <RowDots name="Male" val={sexListFree?.male} color="#08cba5" />
                                <RowDots name="Female" val={sexListFree?.female} color="#ed1944" />

                            </div>
                        </Row>
                    </div>
                </Col>

                <Col md={5} >
                    <Card>
                        <Card.Body>
                            <h3 className='mb-4'>Âge moyen</h3>
                            <Row noGutters>
                                <Col md={8}>
                                    <h4>Global Users</h4>
                                </Col>
                                <Col md={4}>
                                    <h4>{averageGlobal}</h4>
                                </Col>
                            </Row>
                            <Row noGutters>
                                <Col md={8}>
                                    <h4>Premium Users</h4>
                                </Col>
                                <Col md={4}>
                                    <h4>{averagePremium}</h4>
                                </Col>
                            </Row>
                            <Row noGutters>
                                <Col md={8}>
                                    <h4>Free Users</h4>
                                </Col>
                                <Col md={4}>
                                    <h4>{averageFree}</h4>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={7}>
                    <Card style={{ height: 212, overflowY: "auto" }}>
                        <Card.Body>
                            <h4>Utilisateur par Pays</h4>
                            <Row className="align-items-center" noGutters>
                                <Col md={{ span: 3, offset: 3 }}>
                                    <div className="row no-gutters align-items-center justify-content-center">
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "red" }} className="mr-1"></div>
                                        <span  >Global</span>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="row no-gutters align-items-center justify-content-center">
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "blue" }} className="mr-1"></div>
                                        <span>Premium</span>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="row no-gutters align-items-center justify-content-center">
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "green" }} className="mr-1"></div>
                                        <span>Free</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row >
                                {
                                    Object.keys(countryWise).map(val => {
                                        return <Col md={12}>
                                            <Row noGutters className="justify-content-between">
                                                <Col md={3}>
                                                    <div className="text-secondary" style={{ fontSize: "1.0rem" }}>{val}</div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className=" w-100 text-center" style={{ fontSize: "1.0rem", color: "red" }}>{fetchLength(countryWise[val], "global")}</div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className=" w-100 text-center" style={{ fontSize: "1.0rem", color: "blue" }}>{fetchLength(countryWise[val], "PREMIUM")}</div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className=" w-100 text-center" style={{ fontSize: "1.0rem", color: "green" }}>{fetchLength(countryWise[val], "FREE")}</div>
                                                </Col>
                                            </Row>

                                        </Col>
                                    })
                                }

                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <div className="shadow p-2 pt-3 round fit-content w-100 mb-4 bg-white">
                        <h5 className="text-center mb-3 text-secondary font-weight-bold">Utilisateurs globaux hebdomadaires</h5>
                        <Chart type="week" data={weeklyGlobalGraph} x={"Week"} y={"Users"} />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="shadow p-2 pt-3 round fit-content w-100 mb-4 bg-white">
                        <h5 className="text-center mb-3 text-secondary font-weight-bold">Utilisateurs globaux mensuels</h5>
                        <Chart type="month" data={monthlyGlobalGraph} x={"Month"} y={"Users"} />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="shadow p-2 pt-3 round fit-content w-100 mb-4 bg-white">
                        <h5 className="text-center mb-3 text-secondary font-weight-bold">Utilisateurs Premium hebdomadaires</h5>
                        <Chart type="week" data={weeklyPremGraph} x={"Week"} y={"Users"} />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="shadow p-2 pt-3 round fit-content w-100 mb-4 bg-white">
                        <h5 className="text-center mb-3 text-secondary font-weight-bold">Utilisateurs Premium mensuels</h5>
                        <Chart type="month" data={monthlyPremGraph} x={"Month"} y={"Users"} />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="shadow p-2 pt-3 round fit-content w-100 mb-4 bg-white">
                        <h5 className="text-center mb-3 text-secondary font-weight-bold">Utilisateurs gratuits hebdomadaires</h5>
                        <Chart type="week" data={weeklyFreeGraph} x={"Week"} y={"Users"} />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="shadow p-2 pt-3 round fit-content w-100 mb-4 bg-white">
                        <h5 className="text-center mb-3 text-secondary font-weight-bold">Utilisateurs gratuits mensuels</h5>
                        <Chart type="month" data={monthlyFreeGraph} x={"Month"} y={"Users"} />
                    </div>
                </Col>

                {/* <Col md={6} xl={4}>
                    <Card className='card-social'>
                        <Card.Body className='border-bottom'>
                            <div className="row align-items-center justify-content-center">
                                <div className="col-auto">
                                    <i className="fa fa-facebook text-primary f-36" />
                                </div>
                                <div className="col text-right">
                                    <h3>12,281</h3>
                                    <h5 className="text-c-green mb-0">+7.2% <span className="text-muted">Total Likes</span></h5>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="row align-items-center justify-content-center card-active">
                                <div className="col-6">
                                    <h6 className="text-center m-b-10"><span className="text-muted m-r-5">Target:</span>35,098</h6>
                                    <div className="progress">
                                        <div className="progress-bar progress-c-theme" role="progressbar" style={{ width: '60%', height: '6px' }} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <h6 className="text-center  m-b-10"><span className="text-muted m-r-5">Duration:</span>350</h6>
                                    <div className="progress">
                                        <div className="progress-bar progress-c-theme2" role="progressbar" style={{ width: '45%', height: '6px' }} aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" />
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={4}>
                    <Card className='card-social'>
                        <Card.Body className='border-bottom'>
                            <div className="row align-items-center justify-content-center">
                                <div className="col-auto">
                                    <i className="fa fa-twitter text-c-blue f-36" />
                                </div>
                                <div className="col text-right">
                                    <h3>11,200</h3>
                                    <h5 className="text-c-purple mb-0">+6.2% <span className="text-muted">Total Likes</span></h5>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="row align-items-center justify-content-center card-active">
                                <div className="col-6">
                                    <h6 className="text-center m-b-10"><span className="text-muted m-r-5">Target:</span>34,185</h6>
                                    <div className="progress">
                                        <div className="progress-bar progress-c-green" role="progressbar" style={{ width: '40%', height: '6px' }} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <h6 className="text-center  m-b-10"><span className="text-muted m-r-5">Duration:</span>800</h6>
                                    <div className="progress">
                                        <div className="progress-bar progress-c-blue" role="progressbar" style={{ width: '70%', height: '6px' }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" />
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card className='card-social'>
                        <Card.Body className='border-bottom'>
                            <div className="row align-items-center justify-content-center">
                                <div className="col-auto">
                                    <i className="fa fa-google-plus text-c-red f-36" />
                                </div>
                                <div className="col text-right">
                                    <h3>10,500</h3>
                                    <h5 className="text-c-blue mb-0">+5.9% <span className="text-muted">Total Likes</span></h5>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="row align-items-center justify-content-center card-active">
                                <div className="col-6">
                                    <h6 className="text-center m-b-10"><span className="text-muted m-r-5">Target:</span>25,998</h6>
                                    <div className="progress">
                                        <div className="progress-bar progress-c-theme" role="progressbar" style={{ width: '80%', height: '6px' }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <h6 className="text-center  m-b-10"><span className="text-muted m-r-5">Duration:</span>900</h6>
                                    <div className="progress">
                                        <div className="progress-bar progress-c-theme2" role="progressbar" style={{ width: '50%', height: '6px' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" />
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col> */}
            </Row>
        </Aux>
    );
}
