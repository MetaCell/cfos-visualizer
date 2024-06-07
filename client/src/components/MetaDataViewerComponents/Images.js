import React, {useEffect, useState} from "react";
import {Divider, Stack, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import variables from "../../theme/variables";
import {RichTreeView} from "@mui/x-tree-view/RichTreeView";
import CustomTreeItem from "./CustomTreeItem";
import {
  BuildHierarchyTree,
  DoDataPreprocessing,
  filterDictByKeys,
  getCurrentExperimentActivityMaps, GetUniqueHierarchyRoots
} from "../../helpers/ImagesTreeViewHelpers";

const { gray300, gray25} = variables;
const Images = () => {
  const activeAtlas = useSelector(state => state.viewer.atlas);
  const activityMapsMetadata = useSelector(state => state.model.ActivityMaps);
  const atlasActivityMaps = useSelector( state => state.model.AtlasActivityMap );
  const currentExperiment = useSelector(state => state.currentExperiment);
  const ExperimentsActivityMap = useSelector(state => state.model.ExperimentsActivityMap);
  const [treeData, setTreeData] = useState([]);
  
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
    const processedFilteredActivityMaps = DoDataPreprocessing(filteredActivityMaps, currentExperiment?.id);
    const hierarchyRoots = GetUniqueHierarchyRoots(processedFilteredActivityMaps);
    
    let finalTree = [];
    let othersNodes = [];
    
    // Build the tree for all hierarchy roots except 'others'
    for (const hierarchyRoot of hierarchyRoots.filter(root => root !== 'others')) {
      const hierarchyTreeAllData = Object.values(processedFilteredActivityMaps).filter(obj => obj.hierarchy[0] === hierarchyRoot);
      const hierarchyTreeMaxLevel = hierarchyTreeAllData.reduce((acc, obj) => Math.max(acc, obj.hierarchy.length), 0);
      const deepestHierarchyArray = hierarchyTreeAllData.reduce((acc, obj) => {
        if(obj.hierarchy.length > acc.length){
          return obj.hierarchy;
        }
        return acc;
      }, []);
      finalTree.push(...BuildHierarchyTree(hierarchyTreeAllData, hierarchyTreeMaxLevel, deepestHierarchyArray, 0));
    }
    
    // Collect 'others' nodes to be pushed at the end
    for (const hierarchyRoot of hierarchyRoots.filter(root => root === 'others')) {
      const hierarchyTreeAllData = Object.values(processedFilteredActivityMaps).filter(obj => obj.hierarchy[0] === hierarchyRoot);
      othersNodes.push(...hierarchyTreeAllData.map(obj => ({
        id: obj.key,
        label: obj.key
      })));
    }
    
    // Push 'others' nodes at the end of the tree
    finalTree.push(...othersNodes);
    
    return finalTree;
  };
  
  
  
  useEffect(() => {
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