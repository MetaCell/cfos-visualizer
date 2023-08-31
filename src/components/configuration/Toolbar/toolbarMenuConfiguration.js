import React from 'react';
import vars from "../../../theme/variables";
import { ArticleIcon, DropdownIcon } from '../../../icons';
import { Box, Typography } from '@mui/material';

const { primaryFont, headerButtonColor, headerBorderColor } = vars;

export const toolbarMenu = {
  global: {
    buttonsStyle: {
      standard: {
        background: 'transparent',
        borderRadius: 0,
        border: 0,
        boxShadow: 'none',
        color: headerButtonColor,
        fontSize: '0.875rem',
        fontFamily: primaryFont,
        margin: '0',
        minWidth: '0.0625rem',
        padding: '11px 0.75rem',
        height: 'auto',
        textTransform: 'capitalize',
        textAlign: 'left',
        alignItems: 'center',
        gap: '0.5rem',
        justifyContent: 'center',
        marginTop: '0',
        lineHeight: '1',
        fontWeight: 400,
      },
      hover: {
        background: 'transparent',
        borderRadius: 0,
        border: 0,
        boxShadow: 'none',
        color: headerButtonColor,
        fontSize: '0.875rem',
        fontFamily: primaryFont,
        textDecoration: 'none',
        margin: '0',
        minWidth: '0.0625rem',
        height: 'auto',
        textTransform: 'capitalize',
        textAlign: 'left',
        justifyContent: 'start',
        marginTop: '0',
        fontWeight: 400
      }
    },
    drawersStyle: {
      standard: {
        top: '0.0625rem',
        backgroundColor: headerBorderColor,
        boxShadow: '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
        borderRadius: '8px',
        border: '1px solid #302F31',
        padding: '0 8px',
        color: headerButtonColor,
        fontSize: '0.875rem',
        fontFamily: primaryFont,
        minWidth: '7.75rem',
        fontWeight: 400
      },
      hover: {
        top: '0.0625rem',
        padding: '0 8px',
        backgroundColor: headerBorderColor,
        borderRadius: '0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03)',
        borderRadius: '0.125rem',
        color: headerButtonColor,
        fontSize: '0.875rem',
        fontFamily: primaryFont,
        minWidth: '7.75rem',
        fontWeight: 400,
      }
    },
    labelsStyle: {
      standard: {
        borderRadius: '6px',
        color: headerButtonColor,
        gap: '0',
        fontSize: '0.875rem',
        padding: '0 12px',
        fontFamily: primaryFont,
        lineHeight: '129%',
        minHeight: '44px',
        fontWeight: 500,
        height: 'auto'
      },
      hover: {
        background: "#302F31",
        borderRadius: '6px',
        color: headerButtonColor,
        lineHeight: '129%',
        padding: '0 12px',
        fontSize: '0.875rem',
        fontFamily: primaryFont,
        fontWeight: 500,
        gap: '0',
        minHeight: '44px',
        height: 'auto'
      }
    },
    iconStyle: {
      // display: 'inline-block',
      color: 'currentColor',
      minWidth: '1.5rem',
      width: '1.5rem',
    },
  },
  itemOptions: { customArrow: <i style={{ marginLeft: 'auto', marginRight: 0, paddingLeft: '1rem', fontSize: '1rem'}} className="fa fa-angle-right menu-caret" /> },
  buttons: [
    {
      label: (
        <Box component='span' display='flex' alignItems='center'>
          <Typography sx={{ fontSize: '0.875rem', marginRight: '0.5rem', fontWeight: 600, color: '#D6D5D7', lineHeight: '142.857%' }}>Effect of psilocybin on c-Fos-IF in distinct contexts</Typography>
          <DropdownIcon />
        </Box>
      ),
      icon: <Box display='flex' mr='0.5rem'><ArticleIcon /></Box>,
      action: {},
      position: "bottom-start",
      list: [
        {
          label: "Experiments",
          icon: "",
          action: {
            handlerAction: "openNewTab",
            parameters: []
          },
          className: 'list-heading'
        },
        {
          label: "Effect of psilocybin on c-Fos-IF in distinct contexts",
          icon: "fa fa-check",
          action: {
            handlerAction: "openNewTab",
            parameters: []
          }
        },
        {
          label: "Naltrexone’s effect on ketamine-associated c-Fos-IF",
          icon: "fa fa-check",
          action: {
            handlerAction: "openNewTab",
            parameters: []
          }
        },
        {
          label: "Comparative Analysis of Mouse Brain c-Fos-IF Expression under LSD and DMT",
          icon: "fa fa-check",
          action: {
            handlerAction: "clickFeedback",
            parameters: []
          }
        },
        {
          label: "Effects of Mescaline on c-Fos-IF Expression in Sensory Regions",
          icon: "fa fa-check",
          position: "right-start",
          action: {
            handlerAction: "submenu",
            parameters: []
          },
          list: [
            {
              label: "Atlas",
              icon: "",
              action: {
                handlerAction: "openNewTab",
                parameters: []
              },
              className: 'list-heading'
            },
            {
              label: "gubra_ano_combined_21um.nii.gz",
              icon: "",
              action: {
                handlerAction: "openNewTab",
                parameters: []
              },
              className: 'secondary-color',
              list: [
                {
                  label: "Atlas metadata",
                  icon: "",
                  action: {
                    handlerAction: "openNewTab",
                    parameters: []
                  },
                  className: 'list-heading'
                },
                {
                  label: (
                    <>
                      <Typography sx={ { fontSize: '0.875rem', color: '#FCFCFD' } }>
                        gubra_ano_combined_21um.nii.gz
                      </Typography>
                      <Box sx={{ fontSize: '0.875rem', marginTop: '10px', padding: '10px', color: '#8D8D91', borderRadius: '4px', border: '1px solid #302F31' }}>
                        CCFv3 of the Allen brain atlas adapted for iDISCO+/LSFM
                      </Box>
                    </>
                  ),
                  icon: "",
                  action: {
                    handlerAction: "openNewTab",
                    parameters: []
                  },
                },
              ]
            },
            {
              label: "gubra_ano_combined_25um.nii.gz",
              icon: "",
              action: {
                handlerAction: "openNewTab",
                parameters: []
              },
              className: 'secondary-color',
            },
            {
              label: "gubra_template_25um.nii.gz",
              icon: "",
              action: {
                handlerAction: "openNewTab",
                parameters: []
              },
              className: 'secondary-color',
            }
          ]
        },
        {
          label: "Salvinorin A's Effects on c-Fos-IF Activation in Distinct Mouse Brain Regions",
          icon: "fa fa-check",
          action: {
            handlerAction: "openNewTab",
            parameters: []
          }
        },
        {
          label: "Effects of 2C-B on c-Fos-IF Expression in Specific Mouse Neural Circuits",
          icon: "fa fa-check",
          action: {
            handlerAction: "openNewTab",
            parameters: []
          }
        },
        {
          label: "Effect of psilocybin on c-Fos-IF in distinct contexts",
          icon: "fa fa-check",
          action: {
            handlerAction: "openNewTab",
            parameters: []
          }
        },
        {
          label: "Naltrexone’s effect on ketamine-associated c-Fos-IF",
          icon: "fa fa-check",
          action: {
            handlerAction: "openNewTab",
            parameters: []
          }
        },
      ]
    },
  ]
};
