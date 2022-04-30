import React from 'react';
import {NavLink} from 'react-router-dom';

import '../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "../../../App/layout/AdminLayout/Breadcrumb";
import api from "../../../utils/api";

class SignUp extends React.Component {

    render () {

        const signUpParticulier = async (email, mdp) => {
            try {
                    const { status, data } = await api.signupParticulier(email, mdp, false, false, false);
                    if(status === 200) {
                        alert("Un email de confirmation vient d'être envoyé");
                    }
                } catch (error){
                    alert("Echec lors de la création du compte, veuillez réessayer");
                    return false;
                }
        };

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
                                    <i className="feather icon-user-plus auth-icon"/>
                                </div>
                                <h3 className="mb-4">Inscription</h3>
                                <div className="input-group mb-3">
                                    <input id="email" type="email" className="form-control" placeholder="Email"/>
                                </div>
                                <div className="input-group mb-4">
                                    <input id="mdp" type="password" className="form-control" placeholder="Mot de passe"/>
                                </div>
                                <button className="btn btn-primary shadow-2 mb-4" onClick={() => {signUpParticulier("test", "test")}}>Me connecter</button>
                                <p className="mb-0 text-muted">Vous avez déjà un compte? <NavLink to="/auth/signin">Connectez vous</NavLink></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Aux>
        );
    }
}

export default SignUp;
