import { createMuiTheme } from '@material-ui/core/styles';

export const colors = {
    white: '#fff',
    black: '#000',
    border: '#cfcfe1',
    borderFocus: '#b2b2e7',
    borderError: '#e0bbbb',
    label: '#73738b',
    blueBg: '#0092a8',
    lightGreyBg: '#f7f8fa',
    lightGreyFont: '#a4a6aa',
    greyBg: '#f3f4f7',
    red: '#ff7272',
    borderColor: '#cfcfe1',
    blueBtn: '#00adc7',
    green: '#00c853',
};

export const fontSizes = {
    main: 14,
    table: 13,
    menu: 15,
    button: 16,
    title: 20,
    subTitle: 18,
    largeTitle: 42,
};

const theme = createMuiTheme({
    typography: {
        fontFamily: '"Work Sans", sans-serif',
        fontSize: fontSizes.main,
        htmlFontSize: fontSizes.main,
    },
    palette: {
        common: {
            black: colors.black,
            white: colors.white,
        },
        primary: {
            main: '#00adc7',
            contrastText: colors.white,
        },
        secondary: {
            main: '#00c853',
            contrastText: colors.white,
        },
        error: {
            main: '#ff7272',
            contrastText: colors.white,
        },
        background: {
            default: '#f7f8fa',
            paper: colors.white,
        },
        text: {
            primary: colors.black,
            secondary: colors.label,
            disabled: colors.label,
            hint: colors.lightGreyFont,
        },
        divider: '#e3e4e8',
        action: {
            active: colors.borderFocus,
            hover: colors.borderFocus,
            hoverOpacity: 0.08,
            selected: colors.borderFocus,
            disabled: '#e4e4f3',
            disabledBackground: '#f3f4f7',
        },
    },
    overrides: {
        MuiInputBase: {
            input: {
                height: 20, // '1.125em',
                padding: '16px 22px',
                fontSize: fontSizes.main,
            },
            multiline: {
                padding: 0,
            },
            inputMultiline: {
                minHeight: 48,
                padding: '16px 22px',
            },
        },
        MuiButton: {
            root: {
                'fontSize': fontSizes.button,
                'textTransform': 'none',
                'padding': '12px 30px',
                '&$disabled': {
                    backgroundColor: colors.green,
                    color: colors.white,
                    opacity: 0.8,
                },
                '@media(max-width: 600px)': {
                    padding: '10px 26px',
                    fontSize: fontSizes.main,
                },
            },
            contained: {
                'boxShadow': 'none !important',
                '&$disabled': {
                    backgroundColor: colors.green,
                    color: colors.white,
                },
            },
            sizeSmall: {
                fontSize: fontSizes.table,
                padding: '6px 20px',
            },
        },
        MuiTableCell: {
            root: {
                'fontSize': fontSizes.table,
                '& > a': {
                    fontWeight: 500,
                    color: colors.green,
                    padding: '10px 14px',
                },
            },
            head: {
                'fontWeight': 500,
                'padding': '8px 10px 8px',
                'color': colors.lightGreyFont,
                '@media(max-width: 600px)': {
                    padding: '5px 10px 5px',
                },
            },
            body: {
                'padding': '20px 10px 18px',
                'borderBottom': '1px solid rgba(0, 0, 0, 0.14)',
                '@media(max-width: 600px)': {
                    padding: '10px 10px 8px',
                },
            },
        },
        MuiIconButton: {
            root: {
                '&$disabled': {
                    opacity: 0.5,
                },
            },
        },
        MuiBackdrop: {
            root: {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
        },
        MuiPaper: {
            elevation1: {
                boxShadow: '0 0 1px 0 rgba(0, 0, 0, 0.14)',
            },
            elevation2: {
                boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.1)',
            },
            rounded: {
                borderRadius: 4,
            },
        },
        MuiExpansionPanel: {
            rounded: {
                '&:first-child': {
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                },
                '&:last-child': {
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                },
            },
        },
        MuiExpansionPanelSummary: {
            content: {
                'margin': 0,
                '&$expanded': {
                    margin: 0,
                },
            },
            root: {
                padding: '0 22px',
            },
            expandIcon: {
                right: 30,
                position: 'absolute',
            },
        },
        MuiExpansionPanelDetails: {
            root: {
                paddingTop: 0,
            },
        },
        MuiFormHelperText: {
            root: {
                'display': 'inline-block',
                '&$error': {
                    marginTop: 6,
                    marginBottom: 10,
                    position: 'absolute',
                    bottom: -25,
                },
            },
        },
        MuiFormControlLabel: {
            label: {
                color: colors.label,
                fontSize: fontSizes.main,
            },
        },
        MuiSelect: {
            icon: {
                color: colors.black,
                right: 15,
                backgroundColor: colors.white,
            },
        },
        MuiInputAdornment: {
            positionEnd: {
                marginRight: 12,
                // color: colors.lightGreyFont //TODO styled adornment color
            },
        },
        MuiAvatar: {
            colorDefault: {
                color: colors.white,
                backgroundColor: colors.blueBg,
            },
        },
        MuiDialog: {
            paperWidthSm: {
                '@media(max-width: 600px)': {
                    margin: 18,
                    width: '100%',
                },
                '@media(max-width: 320px)': {
                    margin: 0,
                    width: '100%',
                },
            },
            paperScrollPaper: {
                '@media(max-width: 320px)': {
                    maxHeight: '100%',
                    minHeight: '100%',
                },
            },
            container: {
                '@media(max-width: 320px)': {
                    backgroundColor: colors.white,
                },
            },
        },
    },
});

export default theme;
