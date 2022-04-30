import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Fullscreen from "react-full-screen";
import windowSize from 'react-window-size';

import Navigation from './Navigation';
import NavBar from './NavBar';
import Breadcrumb from './Breadcrumb';
import Loader from "../Loader";
import Aux from "../../../hoc/_Aux";
import * as actionTypes from "../../../store/actions";

import './app.scss';
import BlogMain from '../../pages/Blog';
import Forum from '../../pages/Forum';
import Dashboard from '../../pages/Dashboard';
import ForumEdit from '../../pages/ForumEdit';
import BlogEdit from '../../pages/BlogEdit';
import { retrievedFromJwt } from '../../../utils/user-infos';
import Chat from '../../pages/Chat';
import ForumReport from '../../pages/ForumReport';
import MessageReport from '../../pages/MessageReport';

class AdminLayout extends Component {


    fullScreenExitHandler = () => {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            this.props.onFullScreenExit();
        }
    };

    componentDidMount() {
        if (localStorage.getItem("token") == null || localStorage.getItem("token") === undefined) {

            this.props.history.push("/signin");
        }
        else {
            if (retrievedFromJwt(localStorage.getItem("token")) === null) {
                this.props.history.push("/signin");
            }
        }
    }

    componentWillMount() {
        if (this.props.windowWidth > 992 && this.props.windowWidth <= 1024 && this.props.layout !== 'horizontal') {
            this.props.onComponentWillMount();
        }
    }

    mobileOutClickHandler() {
        if (this.props.windowWidth < 992 && this.props.collapseMenu) {
            this.props.onComponentWillMount();
        }
    }

    render() {

        /* full screen exit call */
        document.addEventListener('fullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('webkitfullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('mozfullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('MSFullscreenChange', this.fullScreenExitHandler);


        const setNavVisiblity = (val) => {
            console.log({ val })
            this.setState({ navVisibility: val })
        }


        return (
            <Aux>
                <Fullscreen enabled={this.props.isFullScreen}>
                    <Navigation />
                    <NavBar />
                    <div className="pcoded-main-container" onClick={() => this.mobileOutClickHandler}>
                        <div className="pcoded-wrapper">
                            <div className="pcoded-content">
                                <div className="pcoded-inner-content">
                                    <Breadcrumb />
                                    <div className="main-body">
                                        <div className="page-wrapper">
                                            <Suspense fallback={<Loader />}>
                                                <Switch>
                                                    <Route exact path="/" component={() => <Dashboard />} />
                                                    <Route path="/blog" component={() => <BlogMain />} />
                                                    <Route path="/forum" component={() => <Forum />} />
                                                    <Route path="/forum-report" component={ForumReport} />
                                                    <Route path="/forum:id" component={() => <ForumEdit />} />
                                                    <Route path="/blogEdit" component={() => <BlogEdit />} />
                                                    <Route path="/usermessage" component={() => <Chat type="user" />} />
                                                    <Route path="/associationmessage" component={() => <Chat type="association" />} />
                                                    <Route path="/message-report" component={MessageReport} />
                                                </Switch>
                                            </Suspense>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fullscreen>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        defaultPath: state.defaultPath,
        isFullScreen: state.isFullScreen,
        collapseMenu: state.collapseMenu,
        configBlock: state.configBlock,
        layout: state.layout
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFullScreenExit: () => dispatch({ type: actionTypes.FULL_SCREEN_EXIT }),
        onComponentWillMount: () => dispatch({ type: actionTypes.COLLAPSE_MENU })
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(windowSize(AdminLayout));