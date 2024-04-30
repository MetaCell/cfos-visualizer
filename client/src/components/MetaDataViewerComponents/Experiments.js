import React from "react";
import { Stack, Typography} from "@mui/material";
import variables from "../../theme/variables";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useSelector} from "react-redux";
import ExperienceDetailsDialog from "./ExperienceDetailsDialog";
import CustomTreeItem from "./CustomTreeItem";


const {  gray300, gray25 } = variables
const Experiments = () => {
  const currentExperiment = useSelector(state => state.currentExperiment);
  const experimentsActivityMaps = useSelector(state => state.model.ExperimentsActivityMap);
  const activityMapsMetadata = useSelector(state => state.model.ActivityMaps);
  const [openDialogDetails, setOpenDialogDetails] = React.useState(false);
  const experimentAtlas = useSelector(state => state.model.ExperimentsAtlas);
  const activeAtlas = useSelector(state => state.viewer.atlas);
  const handleClickOpenDialogDetails = (event)  => {
    event.stopPropagation();
    setOpenDialogDetails(true);
  };
  
  const handleDialogDetailsClose = () => {
    setOpenDialogDetails(false);
  };
  
  
  const orderedExperiments = [currentExperiment?.id, ...Object.keys(experimentsActivityMaps)
    .filter(experiment => experiment !== currentExperiment?.id)].filter(row =>
        experimentAtlas[row][0] === activeAtlas.id && currentExperiment.id !== row);
  
  const experimentsList = orderedExperiments.map((experimentName, index) => {
    const experimentActivityMaps = experimentsActivityMaps[experimentName] || [];
    return {
      id: experimentName,
      label: experimentName,
      children: [{
        id: `activityMaps_${index}`,
        label: 'Activity Maps',
        children: experimentActivityMaps.map(activityMapID => ({
          id: activityMapID,
          label:activityMapsMetadata[activityMapID]?.name
        })),
      }]
    }
  })
  
  return <>
    <Stack spacing='1.5rem'>
      <Typography color={gray300} variant='h4' fontWeight={400}>These are the experiments that share the same currently loaded atlas. You may activate the statistical maps from these experiments to the viewer.</Typography>
      <Typography color={gray25} variant='h4' fontWeight={400}>Other experiments associated with the loaded atlas</Typography>
      <RichTreeView sx={{ mt: '.25rem !important' }} items={experimentsList} slots={{ item: (props) => <CustomTreeItem {...props} handleClickOpenDialogDetails={handleClickOpenDialogDetails} showRightSideContent={true}  /> }} />
      <ExperienceDetailsDialog open={openDialogDetails} handleClose={handleDialogDetailsClose} />
    </Stack>
  </>
}

export default Experiments