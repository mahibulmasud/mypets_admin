import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'


const FcontactContainer = ({ selected, setCurrent, index, setSelected, last_message = "", user, count }) => {

    return (<Row className=" contact-container align-items-center w-100 p-1"
        onClick={() => setSelected()}
        noGutters style={{ backgroundColor: (selected) ? "#C2F3EC" : "inherit" }}>
        <Col xs={3} >
            <div style={{ position: "relative" }}>{(count !== undefined && count) > 0 ? <span
                style={{
                    position: "absolute", zIndex: 3, top: -1, right: 2, width: 25, height: 25,
                    display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "50%", backgroundColor: "#048ab3", color: "white"
                }}>{count > 0 ? count : ""}</span> : ""}<img src={"./image22.png"} /></div>
        </Col>
        <Col xs={9} className="row no-gutters justify-content-center flex-column">
            <h3>
                {user ? user.username : ""}
            </h3>
            <h5>
                {last_message}
            </h5>
        </Col>
    </Row>)
}
export default FcontactContainer;