import React from 'react';
import {NavLink} from 'react-router-dom';

import '../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "../../../App/layout/AdminLayout/Breadcrumb";

class SignUp1 extends React.Component {
    render () {
        return(
            <Aux>
                <Breadcrumb/>
                <div className="auth-wrapper">
                    <div className="auth-content">
                        <div className="auth-bg">
                            <span className="r"/>
                            <span className="r s"/>
                            <span className="r s"/>
                            <span className="r"/>
                        </div>
                        <div className="card">
                            <div className="card-body text-center">
                                <div className="mb-4">
                                    <i className="feather icon-unlock auth-icon"/>
                                </div>
                                <h3 className="mb-4">Connexion</h3>
                                <div className="input-group mb-3">
                                    <input type="email" className="form-control" placeholder="Email"/>
                                </div>
                                <div className="input-group mb-4">
                                    <input type="password" className="form-control" placeholder="Mot de passe"/>
                                </div>
                                <div className="form-group text-left">
                                    <div className="checkbox checkbox-fill d-inline">
                                        <input type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" />
                                            <label htmlFor="checkbox-fill-a1" className="cr"> Se souvenir de moi</label>
                                    </div>
                                </div>
                                <button className="btn btn-primary shadow-2 mb-4">Login</button>
                                <p className="mb-2 text-muted"><NavLink to="/auth/reset-password-1">Mot de passe oubli??? </NavLink></p>
                                <p className="mb-0 text-muted">Vous n'avez pas de compte ? <NavLink to="/auth/signup">Inscrivez-vous</NavLink></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Aux>
        );
    }
}

export default SignUp1;
