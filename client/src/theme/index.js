import vars from "./variables";
import { createTheme } from "@mui/material/styles";

const { primaryFont, primaryBgColor, primaryActiveColor, headerBorderLeftColor, switchTrackColor, headerBorderColor, switchTrackActiveBg, labelColor, chipBg, tooltipBgColor, whiteColor } = vars;

let theme = createTheme();

theme = createTheme( {
  typography: {
    fontFamily: primaryFont,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        *, body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: ${primaryFont}
        }
        body {
          background: ${primaryBgColor}
        }
      `,
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '0.5rem',
          border: '0.0625rem solid var(--gray-600, #302F31)',
          background: '#1E1E1F',
          boxShadow: '0rem 0.5rem 0.5rem -0.25rem rgba(16, 24, 40, 0.03), 0rem 1.25rem 1.5rem -0.25rem rgba(16, 24, 40, 0.08)',
        },
        paperWidthXs: {
          maxWidth: '15.375rem'
        }
      }
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            '& .MuiSvgIcon-root': {
              color: headerBorderLeftColor,
              pointerEvents: 'auto'
            }
          }
        }
      }
    },

    MuiBadge: {
      styleOverrides: {
        root: {
          position: 'static'
        },
        badge: {
          height: '1.375rem',
          minWidth: '1.375rem',
          transform: 'none',
          zIndex: 9,
          right: '0.375rem',
          top: '0.375rem',
        },

        colorPrimary: {
          backgroundColor: primaryActiveColor
        }
      }
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          width: '1.75rem',
          height: '1rem',
          padding: 0,
        },
        track: {
          borderRadius: '0.75rem',
          background: headerBorderLeftColor,
          opacity: 1,
        },
        input: {
          width: '100%',
          left: 0
        },
        thumb: {
          width: '100%',
          height: '100%',
          background: switchTrackColor,
          filter: 'drop-shadow(0rem 0.0625rem 0.125rem rgba(16, 24, 40, 0.06)) drop-shadow(0rem 0.0625rem 0.1875rem rgba(16, 24, 40, 0.10))'
        },
        switchBase: {
          position: 'absolute !important',
          width: '0.75rem',
          height: '0.75rem',
          top: '0.125rem !important',
          left: '0.125rem !important',

          '&.Mui-checked': {
            transform: 'translateX(0.75rem)',

            '& + .MuiSwitch-track': {
              background: switchTrackActiveBg,
              opacity: 1,
            }
          }
        }
      }
    },

    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          width: '100%',
          margin: 0,
          padding: '0.3125rem 0.75rem',
          borderRadius: '0.5rem',
          border: '0.0625rem solid transparent',
          '&:hover': {
            borderColor: 'rgba(48, 47, 49, 0.60)',
          }
        },
        label: {
          overflow: 'hidden',
          color: labelColor,
          textOverflow: 'ellipsis',
          fontSize: '0.875rem',
          fontWeight: 400,
          width: '100%',
          lineHeight: '142.857%'
        }
      }
    },

    MuiChip: {
      styleOverrides: {
        root: {
          height: '1.25rem',
          borderRadius: '0.25rem',
          mixBlendMode: 'screen',
          background: chipBg,
        },
        label: {
          padding: '0 0.625rem',
          fontWeight: 500,
          color: primaryActiveColor,
          fontSize: '0.75rem',
          lineHeight: '150%'
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },

    MuiSlider: {
      styleOverrides: {
        root: {
          color: whiteColor,
        },
        thumb: {
          width: '0.75rem',
          height: '0.75rem',

          '&:hover': {
            boxShadow: 'none'
          },
          '&.Mui-focusVisible': {
            boxShadow: 'none'
          }
        },
        rail: {
          opacity: 1,
          background: 'linear-gradient(90deg, #FFF 0%, #030203 100%)'
        },
        track: {
          border: 'none',
          background: 'transparent'
        }
      }
    },

    MuiPopover: {
      styleOverrides: {
        paper: {
          marginTop: '0.25rem',
          width: '40.125rem',
          borderRadius: '0.5rem',
          right: '0.75rem',
          background: headerBorderColor,
          border: `0.0625rem solid ${headerBorderLeftColor}`,
          boxShadow: '0rem 0.0625rem 0.125rem 0rem rgba(16, 24, 40, 0.05)',

          '&:after': {
            content: '""',
            position: 'sticky',
            bottom: 0,
            left: 0,
            zIndex: 999,
            display: 'block',
            height: '2rem',
            pointerEvents: 'none',
            background: 'linear-gradient(180deg, rgba(30, 30, 31, 0.00) 0%, rgba(30, 30, 31, 0.40) 19.79%, #1E1E1F 100%)',
            borderRadius: '0 0 0.5rem 0.5rem',
          }
        }
      }
    },

    MuiTab: {
      styleOverrides: {
        root: {
          '&.MuiButtonBase-root': {
            minHeight: '0.0625rem',
            textTransform: 'none',
            color: '#737378',
            fontSize: '0.75rem',
            fontWeight: 500,
            lineHeight: '150%',
            minWidth: '0.0625rem',

            '&.Mui-selected': {
              color: '#D6D5D7',
            }
          }
        },
      }
    },

    MuiTabs: {
      styleOverrides: {
        flexContainer: {
          gap: '0.5rem',
        },
        root: {
          padding: '0.5rem 0.75rem',
          borderBottom: '0.0625rem solid #302F31',
          minHeight: '0.0625rem',
        },
        indicator: {
          display: 'none'
        }
      }
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          padding: '0.5rem 0.75rem',
          borderRadius: '0.5rem',
          backgroundColor: tooltipBgColor,
          fontWeight: 600,
          fontSize: '0.75rem'
        },
        tooltipPlacementRight: {
          margin: '0 0 0 0.5rem !important'
        }
      }
    }
  }
} );

export default theme;