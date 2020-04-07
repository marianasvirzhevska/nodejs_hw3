import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router';
// import { useHistory } from 'react-router-dom';

import * as api from '../../utils/apiRequest';
import { LOAD_STATE } from '../../constants';

import AppBar from '../common/AppBar';
import DeliverySteps from './DeliverySteps';

const LoadInfo = () => {
    // const history = useHistory();
    const { params } = useRouteMatch();
    const _id = params.id;

    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [load, setLoad] = useState(null);

    const loadStates = {
        [LOAD_STATE.ON_ROUTE_TO_PICK_UP]: { label: 'On route to pick up.', order: 0 },
        [LOAD_STATE.ARRIVED_TO_PICK_UP]: { label: 'Arrived to pick up.', order: 1 },
        [LOAD_STATE.ON_ROUTE_TO_DELIVERY]: { label: 'On route to delivery.', order: 2 },
        [LOAD_STATE.ARRIVED_TO_DELIVERY]: { label: 'Arrived to delivery.', order: 3 },
    };

    async function fetchData() {
        const url = `/trucks/load-info/${_id}`;
        const res = await api.requestWithToken(url, 'GET');
        res
            .json()
            .then((res) => {
                setLoad(res.dbLoad);
                setLoaded(true);
            })
            .catch((err) => setError(err));
    };

    useEffect(() => {
        fetchData();
    }, []);

    async function changeLoadState(state) {
        const updatedLoad = { ...load };
        const query = {};

        for (const [key, value] of Object.entries(loadStates)) {
            if (value.order === state.order) {
                updatedLoad.state = key;
                query.state = key;
            }
        }

        const url = `/trucks/load-info/${_id}`;
        console.log('backPath', query);
        api.requestWithToken(url, 'PATCH', query)
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                setMessage(res.status);
                setLoad(updatedLoad);
            })
            .catch((err) => {
                setError(err);
                console.error(err);
            });
    };

    const getCurrentLoadState = (type) => {
        return loadStates[type];
    };

    const getSteps = () => {
        return Object.values(loadStates);
    };

    return (
        <div className="root">
            <AppBar
                backPath="/profile"
                title="DRIVER" />
            <div className="container">
                <div className="container-fluid">
                    <div className="paper">
                        <div className="title-row">
                            <h1 className="title">Load Information</h1>
                        </div>
                        {
                            loaded && load ?
                                <div className="load-info">
                                    <div className="load-info--row">
                                        <div className="load-info--label">Load title:</div>
                                        <div className="load-info--name">{load.name}</div>
                                    </div>
                                    <div className="load-info--row">
                                        <div className="load-info--label">Load state:</div>
                                        <div className="load-info--state">
                                            { getCurrentLoadState(load.state).label }
                                        </div>
                                    </div>
                                    <div className="load-dimensions">
                                        <div className="load-label">Width: <b>{load.dimensions.width} cm</b></div>
                                        <div className="load-label">Height: <b>{load.dimensions.height} cm</b></div>
                                        <div className="load-label">Length: <b>{load.dimensions.length} cm</b></div>
                                        <div className="load-label">Payload: <b>{load.payload} kg</b></div>
                                    </div>
                                    <DeliverySteps
                                        activeStep={getCurrentLoadState(load.state)}
                                        steps={getSteps()}
                                        changeStep={changeLoadState}
                                    />
                                </div> :
                                null
                        }
                        {error ? <p className="error">{error}</p> : null}
                        {message ? <p className="message">Message: {message}</p> : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadInfo;
