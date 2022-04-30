import jwt from "jsonwebtoken";

export function retrievedFromJwt(auth) {
    let res = null;
    if (auth) {
        jwt.verify(auth, process.env.REACT_APP_TOKEN_SECRET, function (err, decoded) {
            if (err) {
                console.log({ err })
                res = null;
            } else {
                res = decoded.findUser;
            }
        });
    }
    return res;
}

export function retrieveLanguage() {
    if (localStorage.getItem("i18nextLng") !== undefined) {
        switch (localStorage.getItem("i18nextLng")) {
            case 'fr-FR':
                return 'fr';
            case 'it-IT':
                return 'it';
            case 'de-DE':
                return 'de';
            case 'es-ES':
                return 'es';
            case 'en-EN':
                return 'en';
            case 'pt-PT':
                return 'pt';
            case 'fr':
                return 'fr';
            case 'it':
                return 'it';
            case 'de':
                return 'de';
            case 'es':
                return 'es';
            case 'en':
                return 'en';
            case 'pt':
                return 'pt';
            default:
                return 'fr';
        }
    }
    return 'fr';
}


export function decryptData(data, key) {
    let res = null;
    if (data) {
        jwt.verify(data, process.env.REACT_APP_TOKEN_SECRET, function (err, decoded) {
            if (err) {
                res = null;
            } else {
                res = decoded;
            }
        });
    }
    return res;
}

export function cryptData(data, key) {
    return jwt.sign(
        { data },
        key
    );
}

export function appendLeadingZeroes(n) {
    if (n <= 9) {
        return "0" + n;
    }
    return n
}

export function toDate(date) {
    if (date) {
        var d = new Date(date.toString());
        return appendLeadingZeroes(d.getDate()) + "/" + appendLeadingZeroes(d.getMonth() + 1) + "/" + d.getFullYear();
    }
}

export function toPhoneFormat(number) {
    if (number)
        return (number.toString().length === 9 && number.toString()[0] !== "0") ? ("0" + number) : number;
}
