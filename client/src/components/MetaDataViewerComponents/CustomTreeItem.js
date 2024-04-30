import React, {useState} from "react";
import {TreeItem} from "@mui/x-tree-view";
import {Box, Divider, FormControlLabel, IconButton, Switch, Typography} from "@mui/material";
import {fetchAndAddActivityMapToViewer, removeActivityMapFromViewer} from "../../redux/actions";
import {InfoIcon} from "../../icons";
import variables from "../../theme/variables";
import {useDispatch, useSelector} from "react-redux";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const {   headerBorderColor, primaryActiveColor, gray50, gray200, gray100 } = variables

const CustomTreeItem = React.forwardRef(function MyTreeItem(props, ref) {
  const [expanded, setExpanded] = useState(false);
  const[hovered, setHovered] = useState(false);
  const activeActivityMaps = useSelector(state => state.viewer.activityMaps);
  const activityMapsMetadata = useSelector(state => state.model.ActivityMaps);
  const { showRightSideContent } = props
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
      onClick={handleExpand}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      slots={{
        collapseIcon:  () => <KeyboardArrowUpIcon sx={{ color: gray100 }}/>,
        expandIcon:  () => <KeyboardArrowRightIcon sx={{ color: gray100 }} />,
      }}
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
              fontSize: '0.875rem',
              marginLeft: '-1.75rem',
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
              left: '-1.75rem',
              top: '0',
            },
          }}
          key={props.label}
        >
          <FormControlLabel
            fontWeight="400"
            control={
              <Switch
                checked={!!activeActivityMaps[props.label]}
                onChange={(event) => {
                  if (event.target.checked) {
                    dispatch(fetchAndAddActivityMapToViewer(props.label));
                  } else {
                    dispatch(removeActivityMapFromViewer(props.label));
                  }
                }}
              />
            }
            labelPlacement="start"
            label={activityMapsMetadata[props.label]?.name}
          />
        </Box> :
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography variant='h4' color={gray50} fontWeight={400} sx={{
            '&:before': {
              content: '""',
              height: '100%',
              width: '0.125rem',
              background: headerBorderColor,
              position: 'absolute',
              left: '-1.8rem',
              top: '0',
            },
            '&:hover': {
              '&:before': {
                background: primaryActiveColor,
              }
            },
          }}>
            {props.label}
          </Typography>
          {
            showRightSideContent && !props.label.startsWith('activityMaps') && (expanded || hovered) &&
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