import React from 'react'

export function isMobile() {
    return window.innerWidth <= 900;
}

export function isSmallMobile() {
    return window.innerWidth <= 425;
}
export function checkPasswordFormat(value) {
    if (value.match(/[A-Z]/g) === null || value.length < 8 || value.match(/[a-z]/g) === null
        || value.match(/[0-9]/g) === null || value.match(/[" "]/g) !== null) {
        return false;
    } else {
        return true;
    }
}