import React, { useState, useEffect, useRef, useCallback } from "react";
import { Form } from "react-bootstrap";

let autoComplete;

const loadScript = (url, callback) => {
    let script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {
        script.onload = () => callback();
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
};


function SearchLocationInput(props) {
    const [query, setQuery] = useState((props.value) ? props.value : "");
    const autoCompleteRef = useRef(null);

    const handlePlaceSelect = useCallback((updateQuery) => {
        const addressObject = autoComplete.getPlace();
        if (addressObject !== undefined) {
            let query = addressObject.formatted_address;
            updateQuery(query);
            props.onChange(query);
        } else {
            let query = addressObject;
            updateQuery(query);
            props.onChange(query);
        }
    }, [props]);

    useEffect(() => {
        console.log({ props })
        setQuery(props.value)
    }, [props.value])

    const handleScriptLoad = useCallback((updateQuery, autoCompleteRef) => {
        autoComplete = new window.google.maps.places.Autocomplete(
            autoCompleteRef.current,
            {}
        );
        autoComplete.setFields(["address_components", "formatted_address"]);
        autoComplete.addListener("place_changed", () =>
            handlePlaceSelect(updateQuery)
        );
    }, [handlePlaceSelect]);

    useEffect(() => {
        loadScript(
            `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAP_KEY}&libraries=places`,
            () => handleScriptLoad(setQuery, autoCompleteRef)
        );
    }, [handleScriptLoad]);


    useEffect(() => {
        setQuery(query);
    }, [query]);

    return (
        <div className="search-location-input">
            <Form.Control
                className={props.className + (props.className === "input-mpl" && query ? " not-empty" : "")}
                ref={autoCompleteRef}
                onChange={event => setQuery(event.target.value)}
                value={query}
                placeholder={(props.placeholder) ? props.placeholder : ""}
                autoComplete="none"
                spellCheck="false"
                id="address-input"
                onKeyDown={(e) => e.keyCode === 13 ? props.onKeyDown ? props.onKeyDown() : null : null}
            />
        </div>
    );
}

export default SearchLocationInput;
