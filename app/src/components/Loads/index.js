import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';

import AppBar from '../common/AppBar';

const Loads = () => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = () => {

    };

    return (
        <div className="root">
            {/* <AppBar
                title={loaded ? user.role : 'Profile'}
            /> */}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loads;
