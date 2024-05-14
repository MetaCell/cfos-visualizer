import React, {useEffect, useState} from "react";
import {Divider, Stack, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import variables from "../../theme/variables";
import {RichTreeView} from "@mui/x-tree-view/RichTreeView";
import CustomTreeItem from "./CustomTreeItem";

const { gray300, gray25} = variables;

const filterDictByKeys = (obj, keys) => Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));
const getCurrentExperimentActivityMaps = (activityMapsMetadata, experimentActivityMaps) => Object.keys(activityMapsMetadata)
  .filter(key => experimentActivityMaps.includes(key))
  .reduce((obj, key) => {
    obj[key] = activityMapsMetadata[key];
    return obj;
  }, {});
const Images = () => {
  const activeAtlas = useSelector(state => state.viewer.atlas);
  const activityMapsMetadata = useSelector(state => state.model.ActivityMaps);
  const atlasActivityMaps = useSelector( state => state.model.AtlasActivityMap );
  const currentExperiment = useSelector(state => state.currentExperiment);
  const ExperimentsActivityMap = useSelector(state => state.model.ExperimentsActivityMap);
  const [treeData, setTreeData] = useState([]);
  const dataProcessing = (filteredActivityMaps, currentExperimentName) => {
    // Data preprocessing
    for (const obj of Object.values(filteredActivityMaps)) {
      if (obj.experiment !== undefined) {
        if (obj.experiment === true) {
          if (obj.hierarchy === undefined) {
            obj.hierarchy = [currentExperimentName];
          } else {
            obj.hierarchy = [currentExperimentName, ...obj.hierarchy];
          }
        } else {
          obj.hierarchy = ["others"];
        }
      } else {
        if (obj.hierarchy === undefined) {
          obj.hierarchy = [currentExperimentName];
        } else {
          obj.hierarchy = [currentExperimentName, ...obj.hierarchy];
        }
      }
    }
    
    // Set the level key for each object and the level
    for (const [key, value] of Object.entries(filteredActivityMaps)) {
      value.key = key;
      value.uuid = (Math.random() + 1).toString(36).substring(7);
    }
    
    return filteredActivityMaps;
  };
  
  const getRootLevelForTheTree = (filteredActivityMaps) => {
    const hierarchyRoots = new Set();
    for (const obj of Object.values(filteredActivityMaps)) {
      if (obj.hierarchy.length > 0) {
        hierarchyRoots.add(obj.hierarchy[0]);
      }
    }
    return Array.from(hierarchyRoots);
  };
  
  const BuildTree = (originalData, hierarchyParent, hierarchyIndex) => {
    const children = [];
    
    if (originalData.length === 0) {
      return children;
    }
    
    // get the children of the parentHierarchyLevel
    for (const obj of originalData) {
      if (obj.hierarchy.length === hierarchyIndex + 1) {
        children.push({
          id: obj.key,
          label: activityMapsMetadata[obj.key]?.name,
        });
      }
    }
    
    // get the next level of hierarchy
    const nextHierarchyIndex = hierarchyIndex + 1;
    const nextData = Object.values(originalData).filter(
      (obj) => obj.hierarchy.length >= nextHierarchyIndex + 1
    );
    if (nextData.length === 0) {
      return children;
    } else {
      const nextHierarchyParent =
        nextData[0].hierarchy[nextHierarchyIndex];
      children.push({
        id: nextData[0].hierarchy[nextHierarchyIndex],
        label: nextData[0].hierarchy[nextHierarchyIndex],
        children: BuildTree(
          nextData,
          nextHierarchyParent,
          nextHierarchyIndex
        ),
      });
    }
    
    return children;
  };
  useEffect(() => {
    const getData = () => {
      const atlas = activeAtlas;
      const selectedAtlasActivityMaps = atlas?.id && atlasActivityMaps[atlas.id] ? atlasActivityMaps[atlas.id] : [];
      const experimentActivityMaps = ExperimentsActivityMap[currentExperiment.id];
      const currentExperimentActivityMaps = getCurrentExperimentActivityMaps(
        activityMapsMetadata,
        experimentActivityMaps
      );
      const filteredActivityMaps = filterDictByKeys(
        currentExperimentActivityMaps,
        selectedAtlasActivityMaps
      );
      const data = dataProcessing(filteredActivityMaps, currentExperiment?.id);
      const hierarchyRootsArray = getRootLevelForTheTree(data);
      // build the tree
      let tree = [];
      for (let hierarchyParent of hierarchyRootsArray) {
        // // filter objects in the original data based on the hierarchyRoot
        const allDataUnderHierarchyRoot = Object.values(data).filter(
          (obj) => obj.hierarchy[0] === hierarchyParent
        );
        tree.push({
          id: hierarchyParent,
          label: hierarchyParent,
          children: BuildTree(
            allDataUnderHierarchyRoot,
            hierarchyParent,
            0
          ),
        });
      }
      return tree;
    };

    const newData = getData();
    setTreeData(newData);
    
    return () => {
      // Cleanup function to empty the tree data
      setTreeData([]);
    };
  }, [activeAtlas, activityMapsMetadata, atlasActivityMaps, currentExperiment, ExperimentsActivityMap]);
  
  return <Stack spacing='1.5rem'>
    <Stack spacing='.25rem'>
      <Typography color={gray25} variant='h4' fontWeight={400}>Atlas</Typography>
      <Typography color={gray300} variant='h4' fontWeight={400}>{activeAtlas.id}</Typography>
    </Stack>
    <Divider />
    <RichTreeView items={treeData} slots={{ item: (props) => <CustomTreeItem {...props} /> }} />
  </Stack>
}

export default Images