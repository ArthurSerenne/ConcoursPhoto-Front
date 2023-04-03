import {
    HydraAdmin,
    ResourceGuesser,
    hydraDataProvider,
    fetchHydra,
} from '@api-platform/admin';
import React from 'react';
import './App.scss';

const entrypoint = process.env.REACT_APP_API_ENTRYPOINT;

const dataProvider = hydraDataProvider({
    entrypoint: entrypoint,
    httpClient: fetchHydra,
});

const App = () => {
    return (
        <HydraAdmin dataProvider={dataProvider} entrypoint={entrypoint}>
            <ResourceGuesser name="users" />
            <ResourceGuesser name="members" />
            <ResourceGuesser name="organizations" />
            <ResourceGuesser name="contests" />
        </HydraAdmin>
    );
};

export default App;
