import { HydraAdmin } from "@api-platform/admin";
import React from 'react';
import './App.scss';

const entrypoint = process.env.REACT_APP_API_ENTRYPOINT;

const App = () => {
    return (
        <HydraAdmin entrypoint={entrypoint} />
    );
};

export default App;
