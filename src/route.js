import React from 'react';

const Signin = React.lazy(() => import('./Demo/Authentication/SignIn/SignIn'));
const FormUp = React.lazy(() => import('./Demo/Forms/FormsElements'));

const route = [
    { path: '/auth/signin', exact: true, name: 'Signin', component: Signin },
    { path: '/auth/form', exact: true, name: 'Form', component: FormUp }
];

export default route;
