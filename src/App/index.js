import React, { Component, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import '../../node_modules/font-awesome/scss/font-awesome.scss';

import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';
import routes from "../route";
import SignIn from './pages/Signin';
import ForgetPassword from './pages/ForgetPassword';
import ForgetPasswordToken from './pages/ForgetPasswordToken';

const AdminLayout = Loadable({
    loader: () => import('./layout/AdminLayout'),
    loading: Loader
});

const Blog = () => {
    return <h1>Hello</h1>
}

const Signin = React.lazy(() => import('../Demo/Authentication/SignIn/SignIn'));

class App extends Component {
    render() {

        return (
            <Aux>
                <Suspense fallback={<Loader />}>
                    <Switch>
                        <Route path="/signin" component={SignIn} />
                        <Route exact path="/forgotpassword" component={ForgetPassword} />
                        <Route exact path="/forgotpassword/:token" component={ForgetPasswordToken} />
                        <Route path="/" component={AdminLayout} />

                    </Switch>
                </Suspense>
            </Aux>
        );
    }
}

export default App;