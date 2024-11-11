import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: "#000",
            black: "#fff",
            white: "#000",
            dark: "rgb(16,16,16)",
            light: "#fff",
        },
        dark: "rgb(16,16,16)",
        light: "#fff",
        borderDark: "rgb(51,51,51)",
        borderLight: "rgb(213, 213, 213)"
    },

    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    overflow: "unset"
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-input .css-1pq31d5-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input': {
                        backgroundColor: '#ccc'
                    }
                }
            }
        },
        MuiList: {
            styleOverrides: {
                root: {
                    "&.MuiList-root": {
                        padding: 0,
                    }
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    '&.MuiButtonBase-root': {
                        fontSize: "14px",
                        fontWeight: 500,
                        textTransform: "none"
                    },
                    '&span .MuiTabs-indicator': {
                        backgroundColor: "#ccc"
                    }
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                root: {
                    "& .MuiDialog-paper": {
                        borderRadius: "15px",
                    }
                }
            }
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: "#212121"
                }
            }
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    "&.MuiFab-root": {
                        width: "70px",
                        height: "70px",
                        "&:hover": {
                            transform: "scale(1.05)",
                            transition: "all .1s",
                        }
                    }
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    "&.MuiAvatar-root": {
                        border: "none",
                        fontSize: "15px"
                    }
                }
            }
        }
    }
})

export default theme;