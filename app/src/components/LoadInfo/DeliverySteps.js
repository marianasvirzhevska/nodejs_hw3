import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        margin: '2em 0',
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    title: {
        fontSize: 20,
        fontWeight: 500,
    },
    actions: {
        '& > button': {
            marginRight: 16,
        },
    },
}));

export default function DeliverySteps({ steps, activeStep: initialStep, changeStep }) {
    const classes = useStyles();
    const history = useHistory();

    const [activeStep, setActiveStep] = useState(initialStep.order);
    const [newState, setNewState] = useState(false);

    const getSteps = () => {
        return steps.reduce((result, next) => {
            result[next.order] = (
                <Step key={next.label}>
                    <StepLabel>{next.label}</StepLabel>
                </Step>
            );
            return result;
        }, []);
    };

    const handleNext = (nextStep) => {
        setNewState(true);
        setActiveStep(nextStep);
        if (activeStep === 3) {
            history.push('/profile');
        }
    };

    const handleSendState = () => {
        setNewState(false);
        changeStep(steps.find(({ order }) => activeStep === order));
    };

    const handleCancel = () => {
        setNewState(false);
        setActiveStep(initialStep.order);
    };

    return (
        <div className={classes.root}>
            <Typography className={classes.title}>Update Load state.</Typography>
            <Stepper activeStep={activeStep} alternativeLabel>
                { getSteps() }
            </Stepper>
            <div>
                {activeStep === steps.length ? (
                    <Typography className={classes.instructions}>Load delivered.</Typography>
                ) : (
                    <div className={classes.actions}>
                        <Button variant="contained" color="primary" size="small" onClick={() => handleNext(activeStep + 1)}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next state'}
                        </Button>
                        {
                            newState ?
                                <>
                                    <Button variant="contained" color="secondary" size="small" onClick={handleSendState}>
                                        Submit
                                    </Button>
                                    <Button variant="text" color="default" size="small" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </> :
                                null
                        }

                    </div>
                )}
            </div>
        </div>
    );
}
