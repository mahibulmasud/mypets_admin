import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import "../../assets/scss/style.scss"
import api from "../../utils/api"
import Breadcrumb from "../../App/layout/AdminLayout/Breadcrumb";
import { retrievedFromJwt } from '../../utils/user-infos';

const SignIn = ({ setNavVisiblity }) => {

    const history = useHistory();
    console.log({ history })

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);

    const handleSetShow = () => {
        setShow(!show);
    }

    const signUpParticulier = async () => {
        try {
            const { status, data } = await api.loginUser(email, password);
            if (status === 200) {
                localStorage.setItem("token", data.token);
                history.push("/");
            }
            else {
                alert("Wrong credentials")
            }
        } catch (error) {
            console.log({ error })
            alert("Echec lors de la création du compte, veuillez réessayer");
            return false;
        }
    };


    useEffect(() => {
        console.log(localStorage.getItem("token"), retrievedFromJwt(localStorage.getItem("token")));
    }, [])

    return (
        <>
            <Breadcrumb />
            <div className="auth-wrapper">
                <div className="auth-content">
                    <div className="auth-bg">
                        <span className="r" />
                        <span className="r s" />
                        <span className="r s" />
                        <span className="r" />
                    </div>
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="mb-4">
                                <i className="feather icon-user-plus auth-icon" />
                            </div>
                            <h3 className="mb-4">Inscription</h3>
                            <div className="input-group mb-3">
                                <input id="email" type="email" value={email} onChange={(e) => {
                                    setEmail(e.target.value);
                                }} className="form-control" placeholder="Email" />
                            </div>
                            <div className="input-group mb-4">
                                <input id="mdp" value={password} onChange={(e) => {
                                    setPassword(e.target.value);
                                }} type={show ? "text" : "password"} className="form-control" placeholder="Mot de passe" />
                                <span style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 40, fontSize: 24, border: "1px solid #ced4da", backgroundColor: "#f4f7fa" }}><i onClick={handleSetShow} className={show ? "fa fa-eye-slash" : "fas fa-eye"}></i></span>
                            </div>
                            <button className="btn btn-primary shadow-2 mb-4" onClick={() => { signUpParticulier("test", "test") }}>Me connecter</button>
                            <p className="mb-0 text-muted">Forgot password No worry!<NavLink to="/forgotpassword">Change password</NavLink></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default SignIn;
