import React, { useState, useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import variables from "../../theme/variables";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useSelector} from "react-redux";
import ExperienceDetailsDialog from "./ExperienceDetailsDialog";
import CustomTreeItem from "./CustomTreeItem";

const { gray300, gray25 } = variables;

const Experiments = () => {
  const currentExperiment = useSelector(state => state.currentExperiment);
  const experimentsActivityMaps = useSelector(state => state.model.ExperimentsActivityMap);
  const experimentAtlas = useSelector(state => state.model.ExperimentsAtlas);
  const activeAtlas = useSelector(state => state.viewer.atlas);
  const ExperimentsMetadata = useSelector(state => state.model.ExperimentsMetadata);
  const [openDialogDetails, setOpenDialogDetails] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState(currentExperiment);
  
  useEffect(() => {
    return () => {
      // Cleanup function to clear selectedExperiment
      setSelectedExperiment(null);
    };
  }, []);
  
  const handleClickOpenDialogDetails = (event, experiment) => {
    setSelectedExperiment(experiment.itemId);
    event.stopPropagation();
    setOpenDialogDetails(true);
  };
  
  const handleDialogDetailsClose = () => {
    setOpenDialogDetails(false);
  };
  
  const orderedExperiments = [currentExperiment?.id, ...Object.keys(experimentsActivityMaps)
    .filter(experiment => experiment !== currentExperiment?.id)].filter(row =>
    experimentAtlas[row].includes(activeAtlas.id) && currentExperiment.id !== row);
  
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
          label:activityMapID
        })),
      }]
    };
  });
  
  return (
    <>
      <Stack spacing='1.5rem'>
        <Typography color={gray300} variant='h4' fontWeight={400}>These are the experiments that share the same currently loaded atlas. You may activate the statistical maps from these experiments to the viewer.</Typography>
        <Typography color={gray25} variant='h4' fontWeight={400}>Other experiments associated with the loaded atlas</Typography>
        <RichTreeView sx={{ mt: '.25rem !important' }} items={experimentsList} slots={{ item: (props) => <CustomTreeItem {...props} handleClickOpenDialogDetails={handleClickOpenDialogDetails} showRightSideContent={true}  /> }} />
        <ExperienceDetailsDialog open={openDialogDetails} handleClose={handleDialogDetailsClose} name={selectedExperiment} experiment={ExperimentsMetadata[selectedExperiment]} />
      </Stack>
    </>
  );
};

export default Experiments;
