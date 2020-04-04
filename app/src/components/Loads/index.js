import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import * as api from '../../utils/apiRequest';
import { getServerLoads } from '../../store/actions';

import AppBar from '../common/AppBar';
import LoadItem from './LoadItem';
import AddLoadDialog from './AddLoadDialog';

const Loads = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);
    const storeLoads = useSelector((state) => state.loads);

    const [createDialog, setCreateDialog] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [loads, setLoads] = useState(storeLoads);

    const handleCreate = () => {
        setCreateDialog(!createDialog);
    };

    async function fetchData() {
        const res = await api.requestWithToken('/loads', 'GET');
        res
            .json()
            .then((res) => {
                setLoads(res.loads);
                console.log('loads', loads);
                dispatch(getServerLoads(res.loads));
                setLoaded(true);
            })
            .catch((err) => setError(err));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = () => {
        // setCreateDialog(!createDialog);
    };

    return (
        <div className="root">
            <AppBar
                title={loaded ? user.role : 'Profile'}
            />
            <div className="container">
                <div className="container-fluid">
                    <div className="paper">
                        <div className="title-row">
                            <h1 className="title">Loads</h1>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={handleCreate}
                            >Add Load</Button>
                        </div>
                        <ul className="list">
                            {
                                loaded && loads ?
                                    loads.map((item, i) => {
                                        return (
                                            <LoadItem key={i} load={item}/>
                                        );
                                    }) :
                                    <li>Loads not found.</li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <AddLoadDialog
                open={createDialog}
                handleClose={handleCreate}
            />
        </div>
    );
};

export default Loads;
