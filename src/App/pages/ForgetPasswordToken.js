import React, { useState, useEffect } from 'react'
import { Breadcrumb } from 'react-bootstrap';
import { Link, useHistory, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { checkPasswordFormat } from "../../utils/form-functions"

export default function ForgetPasswordToken() {

    const [passwordValue, setPasswordValue] = useState();
    const [isReset, setIsReset] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [wrongToken, setWrongToken] = useState(false);
    const [show, setShow] = useState(false);

    const handleSetShow = () => {
        setShow(!show);
    }
    const history = useHistory()
    const { token } = useParams();
    useEffect(() => {
        console.log({ token })
        if (token === "" || token.length !== 40) {
            setWrongToken(true)
        }
    }, [token, setWrongToken]);

    function resetPassword(password) {
        if (checkPasswordFormat(password)) {
            setIsLoading(true);
            setWrongToken(false);

            api.resetPassword(token, password).then(result => {
                setIsLoading(false);
                if (result.status === 200) {
                    setWrongToken(false);
                    setIsReset(true);
                } else {
                    setWrongToken(true);
                }
            });
        }
    }
    return (
        <div>
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
                                {
                                    wrongToken ? <h5>Invalid token try again</h5> : isReset ? <h5>Thankyou ! Your password have been changed . Now you can login with your new credentials <Link to="/signin">Login</Link></h5> : <><div className="mb-4">
                                        <i className="feather icon-user-plus auth-icon" />
                                    </div>
                                        <h3 className="mb-4">Reset Password</h3>

                                        <div className="input-group mb-4">
                                            <div className="input-group mb-4">
                                                <input id="mdp" value={passwordValue} onChange={(e) => {
                                                    setPasswordValue(e.target.value);
                                                }} type={show ? "text" : "password"} className="form-control" placeholder="Mot de passe" />
                                                <span style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 40, fontSize: 24, border: "1px solid #ced4da", backgroundColor: "#f4f7fa" }}><i onClick={handleSetShow} className={show ? "fa fa-eye-slash" : "fas fa-eye"}></i></span>
                                            </div>
                                        </div>
                                        {
                                            isLoading ? <button className="btn btn-primary shadow-2 mb-4">Reseting ...</button> : <button className="btn btn-primary shadow-2 mb-4" onClick={() => { resetPassword(passwordValue) }}>Reset</button>
                                        }</>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}
