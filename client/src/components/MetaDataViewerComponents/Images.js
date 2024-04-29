import React from "react";
import {
   Box, Divider, FormControlLabel, FormGroup, Stack, Switch, Typography
} from "@mui/material";
import {useSelector, useDispatch} from "react-redux";
import {fetchAndAddActivityMapToViewer, removeActivityMapFromViewer} from "../../redux/actions";
import variables from "../../theme/variables";


const {primaryActiveColor, headerBorderColor, headerBorderLeftColor, headingColor} = variables;

const filterDictByKeys = (obj, keys) => Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));

const Images = () => {
  const dispatch = useDispatch();
  
  const activeAtlas = useSelector(state => state.viewer.atlas);
  const activeActivityMaps = useSelector(state => state.viewer.activityMaps);
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
  
  return <>
    <Stack spacing='1.5rem'>
      gubra_ano_combined_25um.nii.gz
      <Box px={2} pt={1.25}>
        {[activeAtlas].map((atlas, atlasIndex) => {
          const selectedAtlasActivityMaps = atlas?.id && atlasActivityMaps[atlas.id] ? atlasActivityMaps[atlas.id] : [];
          const filteredActivityMaps = filterDictByKeys(activityMapsMetadata, selectedAtlasActivityMaps);
          const groupByHierarchyActivityMaps = groupByHierarchy(filteredActivityMaps, atlas?.id);
          return Object.keys(groupByHierarchyActivityMaps).map((activityMapKey, activityMapIndex) => (
            <Box key={activityMapKey + activityMapIndex}>
              {atlasIndex !== 0 && (
                <Divider sx={{ mt: 1.5, mb: 1, background: headerBorderLeftColor }} />
              )}
              <Box sx={{
                mt: 1, // Add some top margin for spacing
                ml: 1, // Start with a base left margin
                background: headerBorderColor,
              }}>
                {activityMapKey.split(',').map((level, index) => (
                  <Typography
                    key={index}
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 400,
                      lineHeight: '150%',
                      color: headingColor,
                      mt: `${index * 0.5}rem`, // Increment top margin for each new line
                      ml: `${index * 2}rem`, // Increment left margin to simulate tabbing effect
                    }}>
                    {level}
                  </Typography>
                ))}
              </Box>
              <FormGroup>
                {groupByHierarchyActivityMaps[activityMapKey].map((activityMap, mapIndex) => (
                  <Box
                    key={activityMap.key + mapIndex}
                    sx={{
                      position: 'relative',
                      paddingLeft: '0.25rem',
                      ml: `${activityMapKey.split(',').length * 2}rem`, // Calculate left margin based on hierarchy depth
                      '&:hover:before': {
                        background: primaryActiveColor,
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
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!activeActivityMaps[activityMap.key]}
                          onChange={(event) => {
                            if (event.target.checked) {
                              dispatch(fetchAndAddActivityMapToViewer(activityMap.name));
                            } else {
                              dispatch(removeActivityMapFromViewer(activityMap.name));
                            }
                          }}
                        />
                      }
                      labelPlacement="start"
                      label={activityMap.name}
                    />
                  </Box>
                ))}
              </FormGroup>
            </Box>
          ));
        })}
      </Box>
    </Stack>
  </>
}

export default Images