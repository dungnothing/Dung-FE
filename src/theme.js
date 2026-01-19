import { createTheme } from '@mui/material/styles'

const APP_BAR_HEIGHT = '58px'
const BOARD_BAR_HEIGHT = '60px'
const DASHBOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT})`
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`
const COL_HEADER_HEIGHT = '50px'
const COL_FOOTER_HEIGHT = '56px'

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  trello: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    dashboardContentHeight: DASHBOARD_CONTENT_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COL_HEADER_HEIGHT,
    columnFooterHeight: COL_FOOTER_HEIGHT
  },
  colorSchemes: {
    dark: {
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            p: {
              color: '#B6C2CF'
            }
          }
        },
        MuiTypography: {
          styleOverrides: {
            root: {
              color: '#B6C2CF'
            }
          }
        }
      }
    },
    light: {
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            p: {
              color: '#172b4d'
            }
          }
        },
        MuiTypography: {
          styleOverrides: {
            root: {
              color: '#172b4d'
            }
          }
        }
      }
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.5px',
          '&:hover': { borderWidth: '0.5px' }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': { fontSize: '0.875rem' }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset': {
            borderWidth: '0.5px ! important'
          },
          '&:hover fieldset': {
            borderWidth: '1px ! important'
          },
          '& .Mui-focused fieldset': {
            borderWidth: '1px ! important'
          }
        }
      }
    }
  }
})

export default theme
