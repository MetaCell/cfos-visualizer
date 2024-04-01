import React from 'react';
import { Box, Typography } from '@mui/material';
import vars from "../theme/variables";
import {AtlasSelectedIcon} from "../icons";
import {actions, messages} from "../redux/constants";

const { primaryFont, headerButtonColor, headerBorderColor } = vars;

export const generateToolbarItems = (experimentsAtlas, currentExperiment, currentAtlasID, atlasesMetadata) => {
  const toolbarItems = [];
  const experimentID = 'test';

  Object.keys(experimentsAtlas).forEach((experimentAtlasItemKey)=>{ 
    console.log(experimentAtlasItemKey);
    const currentAtlas = experimentsAtlas[experimentAtlasItemKey]
    const atlasName = currentAtlas.name ;
    const atlasID = currentAtlas.name ;
    
    const atlasMetadata = currentAtlas.metadata || messages.NO_METADATA
    return {
      label: (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>{atlasName}</Typography>
          {atlasID === currentAtlasID && experimentID === currentExperiment?.id && <AtlasSelectedIcon />}
        </Box>
    ),
    icon: "",
    action: {
      handlerAction: 'null',
      parameters: []
    },
    className: 'secondary-color',
    list: [
      {
        label: "Atlas metadata",
        icon: "",
        action: {
          handlerAction: 'null',
          parameters: []
        },
        className: 'list-heading'
      },
      {
        label: (
            <>
              <Typography sx={{ fontSize: '0.875rem', color: '#FCFCFD' }}>
                {atlasID}
              </Typography>
              <Box sx={{ fontSize: '0.875rem', marginTop: '10px', padding: '10px', color: '#8D8D91', borderRadius: '4px', border: '1px solid #302F31' }}>
                {atlasMetadata}
              </Box>
            </>
        ),
        icon: "",
        action: {
          handlerAction: actions.FETCH_AND_SET_CURRENT_EXPERIMENT_AND_ATLAS,
          parameters: [experimentID, atlasID]
        },
      }
    ]
  }
  });

  const experimentItem = {
    label: experimentID,
    icon: experimentID === currentExperiment?.id ? "fa fa-check" : "",
    position: "right-start",
    action: {
      handlerAction: 'null',
      parameters: []
    },
    list: [
      {
        label: "Atlas",
        icon: "",
        action: {
          handlerAction: 'null',
          parameters: []
        },
        className: 'list-heading'
      },
      //...atlasList
    ]
  }
    
  toolbarItems.push(experimentItem);

  return toolbarItems;
}

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
};
