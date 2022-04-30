import axios from 'axios';

const burl = process.env.REACT_APP_API_URL;
const headers = {
    "Content-Type": "application/json",
};

export default {
    checkToken: function (token) {
        return axios.get(
            `${burl}/users/checkToken`,
            {
                params: {
                    token: token
                },
                headers: {
                    headers
                }
            }
        );
    },

    checkAddr: function (email) {
        return axios.get(
            `${burl}/users/checkaddr`,
            {
                params: {
                    email: email
                }
            });
    },

    signupParticulier: function (email, mdp, cgu, preference, newsletter) {
        return axios.post(
            `${burl}/users/signupParticulier`,
            {
                params: {
                    email: email,
                    password: mdp,
                    cgu: cgu,
                    preference: preference,
                    newsletter: newsletter,
                },
                headers: {
                    headers
                }
            }
        );
    },

    loginUser: function (email, password) {
        return axios.post(
            `${burl}/users/loginDash`, {
            email: email,
            password: password
        });
    },

    signupPro: function (email, mdp, siret, secteur, cgu, preference, newsletter) {
        return axios.post(
            `${burl}/users/signupPro`,
            {
                params: {
                    email: email,
                    password: mdp,
                    cgu: cgu,
                    preference: preference,
                    newsletter: newsletter,
                    secteur: secteur,
                    siret: siret,
                },
                headers: {
                    headers
                }
            }
        );
    },

    confirmEmail: function (token) {
        return axios.post(
            `${burl}/users/confirmEmail`,
            {
                params: {
                    token: token,
                },
                headers: {
                    headers
                }
            }
        );
    },

    forgotPassword: function (email) {
        return axios.post(
            `${burl}/admin/forgotpassword`,
            {
                email
            }
        );
    },

    resetPassword: function (token, password) {
        return axios.post(
            `${burl}/admin/resetpassword`,
            {
                params: {
                    token: token,
                    password: password,
                    tr: "en"
                },
                headers: {
                    headers
                }
            }
        );
    }

}
