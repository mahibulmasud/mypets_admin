import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';

import ChatList from './ChatList';
import Aux from "../../../../../hoc/_Aux";
import DEMO from "../../../../../store/constant";
import Avatar1 from '../../../../../assets/images/user/avatar-1.jpg';
import Avatar2 from '../../../../../assets/images/user/avatar-2.jpg';
import Avatar3 from '../../../../../assets/images/user/avatar-3.jpg';
import { Link } from 'react-router-dom';

class NavRight extends Component {
    state = {
        listOpen: false
    };

    render() {

        return (
            <Aux>
                <ul className="navbar-nav ml-auto">


                    <li>
                        <Dropdown alignRight={!this.props.rtlLayout} className="drp-user">
                            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                                <i className="icon feather icon-settings" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu alignRight className="profile-notification">
                                <div className="pro-head">
                                    <img src={Avatar1} className="img-radius" alt="User Profile" />
                                    <span>Admin</span>
                                    <a href={DEMO.BLANK_LINK} onClick={() => {
                                        localStorage.removeItem("token");
                                        window.location.href = "/"
                                    }} className="dud-logout" title="Logout">
                                        <i className="feather icon-log-out" />
                                    </a>
                                </div>

                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                </ul>
                <ChatList listOpen={this.state.listOpen} closed={() => { this.setState({ listOpen: false }); }} />
            </Aux>
        );
    }
}

export default NavRight;
