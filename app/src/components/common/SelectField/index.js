import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import { colors, fontSizes } from '../../../muiTheme';


const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: 0,
        },
    },
    input: {
        'borderRadius': 4,
        'position': 'relative',
        'backgroundColor': colors.white,
        'border': '1px solid #ced4da',
        'fontSize': fontSizes.main,
        'padding': '10px 26px 10px 20px',
        'transition': theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderRadius: 4,
            backgroundColor: colors.white,
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
    },
    inputLabel: {
        'position': 'relative',
        'transform': 'none',
        'color': colors.label,
        '&.Mui-focused': {
            color: colors.label,
        },
        'fontSize': fontSizes.table,
        'fontWeight': 500,
        'marginBottom': 9,
        'whiteSpace': 'pre',
    },
    menuPaper: {
        marginTop: 58,
        maxHeight: 300,
    },
    itemRoot: {
        'borderRadius': 3,
        'padding': '5px 7px',
        'color': '#70708f',
        'margin': '0 7px',
        '&:hover': {
            color: colors.white,
            backgroundColor: '#00adc7 !important',
        },
    },
    itemSelected: {
        color: colors.white,
        backgroundColor: '#00adc7 !important',
        borderRadius: 3,
        padding: '5px 7px',
        margin: '0 7px',
    },
    error: {
        fontSize: fontSizes.table,
        color: colors.red,
        marginTop: 8,
    },
}));


const SelectField = (props) => {
    const classes = useStyles();
    const { items, inputId, label, input, meta: { touched, error } } = props;

    return (
        <FormControl className={classes.root}>
            <InputLabel shrink htmlFor={inputId} classes={{ formControl: classes.inputLabel }}>{label}</InputLabel>
            <Select
                {...input}
                MenuProps={{
                    classes: {
                        paper: classes.menuPaper,
                    },
                }}
                input={
                    <BootstrapInput
                        {...input}
                        id={inputId}
                    />
                }
            >
                {items && items.map((item, key) => {
                    return (
                        <MenuItem
                            value={item.valueId}
                            key={key}
                            classes={{
                                root: classes.itemRoot,
                                selected: classes.itemSelected,
                            }}
                        >
                            {item.valueLabel}
                        </MenuItem>
                    );
                })}
            </Select>
            {touched && ((error && <div className={classes.error}>{error}</div>))}
        </FormControl>
    );
};

export default SelectField;
