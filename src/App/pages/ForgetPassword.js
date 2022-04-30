import React, { useState } from 'react'
import api from '../../utils/api';
import Breadcrumb from '../layout/AdminLayout/Breadcrumb';



export default function ForgetPassword() {


    const [mailValue, setMailValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [confirmSend, setConfirmSend] = useState(false);
    const [errorSend, setErrorSend] = useState(false);
    const [errorPseudo, setErrorPseudo] = useState(false);

    function sendResetEmail(pseudo) {
        setConfirmSend(false);
        setErrorSend(false);
        setErrorPseudo(false);
        setIsLoading(true);
        api.forgotPassword(pseudo).then(result => {
            setIsLoading(false);
            if (result.status === 200) {
                setMailValue(result.data.email);
                setConfirmSend(true);
            } else {
                alert("Try again")
            }
        });
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
                            {
                                confirmSend ? <div className="card-body text-center"><h5>An email has been sent to the email id {mailValue} kindly check and reset your password</h5></div> : <div className="card-body text-center">
                                    <div className="mb-4">
                                        <i className="feather icon-user-plus auth-icon" />
                                    </div>
                                    <h3 className="mb-4">Change Password</h3>
                                    <div className="input-group mb-3">
                                        <input id="email" type="email" value={mailValue} onChange={(e) => {
                                            setMailValue(e.target.value);
                                        }} className="form-control" placeholder="Email" />
                                    </div>
                                    {isLoading ? <button className="btn btn-primary shadow-2 mb-4" >Reseting Password...</button> : <button className="btn btn-primary shadow-2 mb-4" onClick={() => { sendResetEmail(mailValue) }}>Reset Password</button>}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}
