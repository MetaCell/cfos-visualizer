
export const filterDictByKeys = (obj, keys) => Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));
export const getCurrentExperimentActivityMaps = (activityMapsMetadata, experimentActivityMaps) => Object.keys(activityMapsMetadata)
  .filter(key => experimentActivityMaps.includes(key))
  .reduce((obj, key) => {
    obj[key] = activityMapsMetadata[key];
    return obj;
  }, {});

export const DoDataPreprocessing = (filteredActivityMaps, currentExperimentName) => {
  /**
   * Data preprocessing
   * If the experiment key or hierarchy key are not exists then add hierarchy array with one element "Experiment Name"
   * Target is : we have the hierarchy array for each object
   */
  for(const obj of Object.values(filteredActivityMaps)){
    // if experiment key exists
    if(obj.experiment !== undefined){
      if(obj.experiment === true){
        // experiment is true
        if(obj.hierarchy === undefined){ // no hierarchy key
          obj.hierarchy = [currentExperimentName]
        }else{
          // hierarchy key exists
          obj.hierarchy =[currentExperimentName,...obj.hierarchy]
        }
      }else {
        // experiment is false
        obj.hierarchy = ['others']
      }
    }else {
      // experiment key not exists
      if(obj.hierarchy === undefined){
        obj.hierarchy =[currentExperimentName]
      }else {
        obj.hierarchy =[currentExperimentName,...obj.hierarchy]
      }
    }
  }
  
  
  /**
   * Set the level key for each object and the level
   * Convert map to array
   */
  for(const [key, value] of Object.entries(filteredActivityMaps)) {
    value.key = key
  }
  
  return filteredActivityMaps
}

export const GetUniqueHierarchyRoots = (processedFilteredActivityMaps) => {
  // Get unique roots of the tree
  const hierarchyRoots= new Set()
  for(const obj of Object.values(processedFilteredActivityMaps)){
    if(obj.hierarchy.length > 0){
      hierarchyRoots.add(obj.hierarchy[0])
    }
  }
  return Array.from(hierarchyRoots)
}

export const BuildHierarchyTree = (hierarchyTreeAllData,hierarchyTreeMaxLevel, deepestHierarchyArray, hierarchyArrayCurrentIndex) => {
  const tree = []
  
  // stop condition
  if(hierarchyArrayCurrentIndex === hierarchyTreeMaxLevel){
    return tree
  }
  
  // get children of the current hierarchy level
  const levelChildren = hierarchyTreeAllData.filter(obj => obj.hierarchy.length === hierarchyArrayCurrentIndex + 1).map(obj => {
    return {
      id: obj.key,
      label: obj.key
    }
  })
  
  // create the new level of the tree
  tree.push({
    id: deepestHierarchyArray[hierarchyArrayCurrentIndex],
    label: deepestHierarchyArray[hierarchyArrayCurrentIndex],
    children: [...levelChildren, ...BuildHierarchyTree(hierarchyTreeAllData, hierarchyTreeMaxLevel, deepestHierarchyArray, hierarchyArrayCurrentIndex+1)]
  })
  
  return tree
}
