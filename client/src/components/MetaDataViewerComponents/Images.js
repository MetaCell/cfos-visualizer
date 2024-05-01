import React from "react";
import {
   Divider, Stack, Typography
} from "@mui/material";
import { useSelector } from "react-redux";
import variables from "../../theme/variables";
import {RichTreeView} from "@mui/x-tree-view/RichTreeView";
import CustomTreeItem from "./CustomTreeItem";

const { gray300, gray25} = variables;

const filterDictByKeys = (obj, keys) => Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));

const Images = () => {
  const activeAtlas = useSelector(state => state.viewer.atlas);
  const activityMapsMetadata = useSelector(state => state.model.ActivityMaps);
  const atlasActivityMaps = useSelector( state => state.model.AtlasActivityMap );

  const groupByHierarchy = (activityMaps, experimentId) => {
    const grouped = {};
    
    Object.entries(activityMaps).forEach(([_, value]) => {
      if ( value.experiment && experimentId && value.hierarchy.indexOf(experimentId) === -1 )
        value.hierarchy.unshift(experimentId);
    });
    
    Object.entries(activityMaps).forEach(([key, value]) => {
      // Convert the hierarchy array into a string to use as a key
      const hierarchyKey = value?.hierarchy?.join(', ');
      
      if (!grouped[hierarchyKey]) {
        grouped[hierarchyKey] = [];
      }
      
      // Add the entire entry, including the key if necessary
      grouped[hierarchyKey].push({...value, key});
    });
    
    return grouped;
  }
  const getData = () => {
    const atlas = activeAtlas;
    const selectedAtlasActivityMaps = atlas?.id && atlasActivityMaps[atlas.id] ? atlasActivityMaps[atlas.id] : [];
    const filteredActivityMaps = filterDictByKeys(activityMapsMetadata, selectedAtlasActivityMaps);
    const groupByHierarchyActivityMaps = groupByHierarchy(filteredActivityMaps, atlas?.id);
    const buildTree = (levels, maps, parentId) => {
      if (levels.length === 0) return null;
      
      const [currentLevel, ...remainingLevels] = levels;
      
      const node = {
        id: `${currentLevel}-${parentId}`,
        label: currentLevel,
        children: []
      };
      
      if (remainingLevels.length === 0) {
        node.children = maps.map((activityMap) => ({
          id: activityMap.key,
          label: activityMap.name
        }));
      } else {
        node.children.push(buildTree(remainingLevels, maps, node.id));
      }
      return node;
    };
    
    return Object.entries(groupByHierarchyActivityMaps).map(([activityMapKey, maps], index) => {
      const levels =  activityMapKey.split(',');
      return buildTree(levels, maps, index);
    });
  }
  
  return <Stack spacing='1.5rem'>
    <Stack spacing='.25rem'>
      <Typography color={gray25} variant='h4' fontWeight={400}>Atlas</Typography>
      <Typography color={gray300} variant='h4' fontWeight={400}>{activeAtlas.id}</Typography>
    </Stack>
    <Divider />
    <RichTreeView items={getData()} slots={{ item: (props) => <CustomTreeItem {...props} /> }} />
  </Stack>
}

export default Images