import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import PropTypes from 'prop-types';
import { colors, fontSizes } from '../../../muiTheme';
import resetIcon from '../../../assets/icons/ico-reset.svg';

const styles = () => ({
    root: {
        'margin': 0,
        'padding': 26,
        'zIndex': 1,
        'boxShadow': '0 1px 4px 0 rgba(0, 0, 0, 0.14)',
        '@media(max-width: 600px)': {
            padding: 16,
        },
    },
    title: {
        'margin': 0,
        'fontWeight': 500,
        'textAlign': 'center',
        'fontSize': fontSizes.subTitle,
        '@media(max-width: 600px)': {
            fontSize: fontSizes.button,
        },
    },
    closeButton: {
        'right': 26,
        'top': 24,
        'padding': 6,
        'borderRadius': 2,
        'position': 'absolute',
        'border': '2px solid rgba(115, 115, 139, 0.3)',
        '& > span > svg': {
            width: 15,
            height: 15,
        },
        '@media(max-width: 600px)': {
            right: 16,
            top: 9,
        },
    },
    resetButton: {
        'top': 16,
        'left': 20,
        'padding': 6,
        'position': 'absolute',
        'border': 'none',
        '& > span > span': {
            fontSize: fontSizes.main,
            color: colors.label,
            fontWeight: 400,
            paddingLeft: 8,
        },
        '&:hover': {
            background: 'transparent',
        },
        '@media(max-width: 600px)': {
            left: 14,
            top: 7,
        },
    },
});

export const AppDialogTitle = withStyles(styles)((props) => {
    const { title, classes, handleClose, handleReset, ...other } = props;

    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            {handleReset ? (
                <Button aria-label="reset" className={classes.resetButton} onClick={handleReset}>
                    <img src={resetIcon} alt="icon"/>
                    <span>Reset</span>
                </Button>
            ) : null}
            <Typography variant="h1" className={classes.title}>{title}</Typography>
            {handleClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                    <CloseRoundedIcon size="small"/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

AppDialogTitle.propTypes = {
    title: PropTypes.string.isRequired,
    handleClose: PropTypes.func,
    handleReset: PropTypes.func,
};

export const AppDialogContent = withStyles((theme) => ({
    root: {
        display: 'flex',
        minWidth: 'auto',
        padding: '8px 14px',
        backgroundColor: colors.lightGreyBg,
        [theme.breakpoints.up('sm')]: {
            minWidth: 520,
            padding: '8px 24px',
        },
    },
}))(MuiDialogContent);


export const AppDialog = (props) => {
    const { children, open, handleClose } = props;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            disableBackdropClick={false}
            PaperProps={{
                elevation: 2,
            }}
        >
            {children}
        </Dialog>
    );
};

AppDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    children: PropTypes.any.isRequired,
    handleClose: PropTypes.func.isRequired,
};
