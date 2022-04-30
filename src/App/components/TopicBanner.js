import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { Chat } from '../svg/Inline/icons'
import { isMobile } from '../../utils/form-functions';
import "./Forum.css"
export default (props) => {
    const { topic, description, tag, response, user, date, id } = props;
    return (<Link to={`/forum:${id}`}>
        {
            tag && <div className="forum-tag">
                {tag}
            </div>

        }
        <Row noGutters className="w-100 shadow align-items-center forum-topic-banner">
            <Col md={1} className="text-center">
                <Chat />
            </Col>
            <Col md={7}>
                <Row noGutters className="flex-column">
                    <h5 className="w-100 text-left">
                        {topic}
                    </h5>
                    <p className="m-0 ">
                        {description}
                    </p>
                </Row>
            </Col>
            <Col className="text-center" md={1}>
                {!isMobile() && <><span style={{ color: "#13E2BA", fontSize: 28, fontWeight: "bold" }} >{response}</span><br /> response</>}
                {
                    isMobile() && <><span style={{ color: "#13E2BA", fontSize: 28, fontWeight: "bold", marginRight: 3 }}>{response}</span> response</>
                }
            </Col>
            <Col>
                <Row noGutters className="w-100 h-100 justify-content-between align-items-center">
                    <div>
                        <img src={(user !== undefined) ? user.avatar : ""} className="profile-avatar" />
                    </div>
                    <div className="p-2 forum-profile-info">
                        <div className="name">Créé par <span style={{ color: "#EC1D45" }}>{`${user !== undefined && user !== "" && user.firstName} ${user !== undefined && user !== "" && user.lastName}`}</span></div>
                        <div className="date">Le {(date !== undefined) ? new Date(date).toLocaleDateString() : ""}</div>
                    </div>
                </Row>

            </Col>
        </Row>
    </Link>)
}
