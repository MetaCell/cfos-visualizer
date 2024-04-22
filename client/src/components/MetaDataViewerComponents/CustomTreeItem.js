import React, {useState} from "react";
import {TreeItem} from "@mui/x-tree-view";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {Box, Divider, FormControlLabel, IconButton, Switch, Typography} from "@mui/material";
import {fetchAndAddActivityMapToViewer, removeActivityMapFromViewer} from "../../redux/actions";
import {InfoIcon} from "../../icons";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import variables from "../../theme/variables";
import {useDispatch, useSelector} from "react-redux";

const {   headerBorderColor, primaryActiveColor, gray50, gray200, gray100 } = variables

const CustomTreeItem = React.forwardRef(function MyTreeItem(props, ref) {
  const [expanded, setExpanded] = useState(false);
  const[hovered, setHovered] = useState(false);
  const activeActivityMaps = useSelector(state => state.viewer.activityMaps);
  const activityMapsMetadata = useSelector(state => state.model.ActivityMaps);
  
  const dispatch = useDispatch();
  
  const handleMouseEnter = () => {
    setHovered(true);
  };
  
  const handleMouseLeave = () => {
    setHovered(false);
  };
  const handleExpand = () => {
    setExpanded(!expanded);
  };
  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        collapseIcon:  () => props.itemId.startsWith('activityMaps') ? null : <KeyboardArrowUpIcon sx={{ color: gray100 }}/>,
        expandIcon:  () => props.itemId.startsWith('activityMaps') ? null : <KeyboardArrowRightIcon sx={{ color: gray100 }} />,
      }}
      onClick={handleExpand}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        marginTop: '.25rem',
        '& .MuiTreeItem-content': {
          '&:hover': {
            backgroundColor: 'transparent !important',
          },
          '&.Mui-focused': {
            backgroundColor: 'transparent !important',
          },
          '&.Mui-selected': {
            backgroundColor: 'transparent !important',
            '&:hover': {
              backgroundColor: 'transparent !important',
            },
          }
        }
      }}
      label={props.children.length === 0 ? <Box
          sx={{
            position: 'relative',
            paddingLeft: '0.25rem',
            
            '& .MuiTypography-root': {
              color: gray200,
              fontSize: '0.875rem'
            },
            '&:hover': {
              '&:before': {
                background: primaryActiveColor,
              }
            },
            '&:before': {
              content: '""',
              height: '100%',
              width: '0.125rem',
              background: headerBorderColor,
              position: 'absolute',
              left: 0,
              top: 0,
            },
          }}
          key={props.itemId}
        >
          <FormControlLabel
            fontWeight="400"
            control={
              <Switch
                checked={!!activeActivityMaps[props.itemId]}
                onChange={(event) => {
                  if (event.target.checked) {
                    dispatch(fetchAndAddActivityMapToViewer(props.itemId));
                  } else {
                    dispatch(removeActivityMapFromViewer(props.itemId));
                  }
                }}
              />
            }
            labelPlacement="start"
            label={activityMapsMetadata[props.itemId]?.name}
          />
        </Box> :
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography variant='h4' color={gray50} fontWeight={400} sx={{
            ...(props.itemId.startsWith('activityMaps') && {
              paddingLeft: '1rem',
              '&:before': {
                content: '""',
                height: '100%',
                width: '0.125rem',
                background: headerBorderColor,
                position: 'absolute',
                left: 0,
                top: 0,
              },
              '&:hover': {
                '&:before': {
                  background: primaryActiveColor,
                }
              },
            }),
          }}>
            {props.label}
          </Typography>
          {
            !props.itemId.startsWith('activityMaps') && (expanded || hovered) &&
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.65rem'}}>
              <Divider orientation="vertical" variant="middle" flexItem sx={{
                height: '1.25rem',
                margin: 0
              }} />
              <IconButton onClick={props.handleClickOpenDialogDetails}>
                <InfoIcon />
              </IconButton>
              <ArrowForwardIcon sx={{
                fontSize: '1.25rem',
                color: gray100
              }} />
            </Box>
          }
        
        </Box>}
    />
  );
});

export default CustomTreeItem