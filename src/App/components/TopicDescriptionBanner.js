import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { Chat, Correct } from '../svg/Inline/icons'
import { isMobile } from '../../utils/form-functions';
import "./Forum.css"
import Toolbox from './Toolbox';
export default (props) => {
    const { topic, description, tag, response, user, date, correct, array, index = null } = props;

    const [toggle, setToggle] = useState(false);
    return (<>
        {
            tag && <div className="forum-tag">
                {tag}
            </div>

        }
        <Row noGutters className="w-100 p-3 shadow  forum-topic-banner">
            <Col md={1} className="text-center">
                {correct !== undefined && correct ? <Correct /> : <Chat />}
            </Col>
            <Col md={7}>
                <Row noGutters className="flex-column">
                    <h5 className="w-100 text-left">
                        {topic}
                    </h5>
                    <p className="m-0 " dangerouslySetInnerHTML={{ __html: description }} />
                </Row>
            </Col>
            {
                array.length > 0 && <div className="position-relative">
                    <i class="fa fa-ellipsis-v" onClick={() => setToggle(!toggle)} aria-hidden="true"></i>
                    {
                        toggle && <Toolbox index={index} correct array={array} />
                    }
                </div>
            }
            <Col>
                <Row noGutters className="w-100 h-100 justify-content-between ">

                    <div>
                        <img src={(user !== undefined) ? user.avatar : ""} className="profile-avatar" />
                    </div>
                    <div className="p-2 forum-profile-info" style={{ justifyContent: "start" }}>
                        <div className="name">Create by <span style={{ color: "#EC1D45" }}>{`${user.firstName} ${user.lastName}`}</span></div>
                        <div className="date">On {(date !== undefined) ? new Date(date).toLocaleDateString() : ""}</div>
                    </div>
                </Row>

            </Col>
        </Row>
    </>)
}
