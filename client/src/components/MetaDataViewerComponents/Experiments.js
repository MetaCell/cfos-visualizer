import React from "react";
import {Box, FormControlLabel, Stack, Switch, Typography} from "@mui/material";
import variables from "../../theme/variables";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {fetchAndAddActivityMapToViewer, removeActivityMapFromViewer} from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {TreeItem} from "@mui/x-tree-view";

const {  gray300, gray25, headerBorderColor, primaryActiveColor } = variables

const Experiments = () => {
  const currentExperiment = useSelector(state => state.currentExperiment);
  const experimentsActivityMaps = useSelector(state => state.model.ExperimentsActivityMap);
  const activeActivityMaps = useSelector(state => state.viewer.activityMaps);
  const activityMapsMetadata = useSelector(state => state.model.ActivityMaps);
  
  const dispatch = useDispatch();
  
  const orderedExperiments = [currentExperiment?.id, ...Object.keys(experimentsActivityMaps)
    .filter(experiment => experiment !== currentExperiment?.id)];
  
  const MUI_X_PRODUCTS = orderedExperiments.slice(1, orderedExperiments.length).map((experimentName) => {
    const experimentActivityMaps = experimentsActivityMaps[experimentName] || [];
    return {
      id: experimentName,
      label: experimentName,
      children: experimentActivityMaps.map(activityMapID => ({
        id: activityMapID,
        label:activityMapsMetadata[activityMapID]?.name
      })),
      
    }
  })
  
  const CustomTreeItem = React.forwardRef(function MyTreeItem(props, ref) {
    return (
      <TreeItem
        {...props}
        ref={ref}
        label={props.children.length === 0 ? <Box
          sx={{
            position: 'relative',
            paddingLeft: '0.25rem',
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
        </Box> : props.itemId}
      />
    );
  });
  
  return <Stack spacing='1.5rem'>
    <Typography color={gray300}>These are the experiments that share the same currently loaded atlas. You may activate the statistical maps from these experiments to the viewer.</Typography>
    <Typography color={gray25}>Other experiments associated with the loaded atlas</Typography>
    <RichTreeView sx={{ mt: '.25rem !important' }} items={MUI_X_PRODUCTS} slots={{ item: CustomTreeItem }} />
   
  </Stack>
}

export default Experiments