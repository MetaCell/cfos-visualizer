import {Box, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import vars from "../theme/variables";
import Table from "./Table";
import {useSelector, useDispatch} from "react-redux";
import {messages} from "../redux/constants";
import CustomSlider from "./Slider";
import {changeAllActivityMapsIntensityRange, changeViewerOrder} from "../redux/actions";


const {headerBorderLeftColor, headingColor, accordianTextColor} = vars;

const styles = {
    controlPanel: {
        borderRadius: '0.5rem 0.5rem 0 0',
        border: '0.0625rem solid rgba(48, 47, 49, 0.60)',
        background: 'linear-gradient(0deg, rgba(30, 30, 31, 0.60) 0%, rgba(30, 30, 31, 0.60) 100%), #0F0F10'
    },
    controlPanelHeader: {
        height: '2.75rem',
        pl: 1.5,
        pr: 3,
        display: 'flex',
        userSelect: 'none',
        alignItems: 'center',
        borderBottom: '0.0625rem solid transparent'
    },

    controlPanelBody: {
        px: 1.5,
        overflow: 'auto',
        transition: 'all 0.3s ease-in-out',
    },

    controlPanelHeaderHeading: {
        color: headingColor,
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: '142.857%',
    },

    controlPanelHeaderSubHeading: {
        color: accordianTextColor,
        marginLeft: 1,
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: '150%',
    },

    transition: {
        transition: 'all ease-in-out .3s'
    },

    pointer: {
        cursor: 'pointer'
    },
};

const move = (arr, fromIndex, toIndex) => {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

const ControlPanel = () => {
    const dispatch = useDispatch();

    const [open, setOpen] = useState(true);
    const activeAtlas = useSelector(state => state.viewer.atlas);
    const activeActivityMaps = useSelector(state => state.viewer.activityMaps);
    const activityMapOrder = useSelector(state => state.viewer.order);
    const intensityRange = useSelector(state => state.viewer.activityMapsIntensityRange);

    const atlasesMetadata = useSelector(state => state.model.Atlases);
    const activityMapsMetadata = useSelector(state => state.model.ActivityMaps);

    const [globalIntensityRange, setGlobalIntensityRange] = useState([0, 100]);
    const getViewerObjectsData = () => {
        const viewerObjects = []

        if (activeAtlas) {
            for (const activityMapId of Object.keys(activeActivityMaps)) {
                const activityMapMetadata = activityMapsMetadata[activityMapId];
                const activityMap = activeActivityMaps[activityMapId];

                viewerObjects.push({
                    id: activityMapId,
                    name: activityMapMetadata.name,
                    description: activityMapMetadata.description || messages.NO_DESCRIPTION,
                    colorRange: activityMap.colorRange,
                    intensityRange: [...activityMap.intensityRange],
                    stackIntensityRange: [...activityMap.stack.minMax],
                    isVisible: activityMap.visibility
                });
            }

            // Rorder depending on the "order" from the store
            viewerObjects.sort((a, b) => activityMapOrder.indexOf(b.id) - activityMapOrder.indexOf(a.id))

            // Atlas should be the last entry in the array
            const atlasId = activeAtlas.id;
            const atlasMetadata = atlasesMetadata[atlasId];

            viewerObjects.push({
                id: atlasId,
                name: atlasMetadata.name,
                description: atlasMetadata.description || messages.NO_DESCRIPTION,
                colorRange: null,
                intensityRange: [...activeAtlas.stack.minMax],
                stackIntensityRange: [...activeAtlas.stack.minMax],
                isVisible: activeAtlas.visibility
            });
        }
        return viewerObjects
    }

    const computeGlobalIntensityRange = () => {
        let globalMin = Infinity;
        let globalMax = -Infinity;

        Object.values(activeActivityMaps).forEach(map => {
            if (map.stack.minMax[0] < globalMin) globalMin = map.stack.minMax[0];
            if (map.stack.minMax[1] > globalMax) globalMax = map.stack.minMax[1];
        });

        if (globalMin !== Infinity && globalMax !== -Infinity) {
            setGlobalIntensityRange([globalMin, globalMax]);
        } else {
            setGlobalIntensityRange([0, 100]);
        }
    };

    useEffect(() => {
        computeGlobalIntensityRange();
    }, [activeActivityMaps]);

    const onIntensityChange = (newValue) => {
        dispatch(changeAllActivityMapsIntensityRange(newValue));
    }

    const viewerObjects = getViewerObjectsData()

    const onReorder = (source, target) => {
        const suborder = activityMapOrder.slice(1, activityMapOrder.length)
        move(suborder, source.index, target.index)
        dispatch(changeViewerOrder([activityMapOrder[0], ...suborder]))
    }

    return (
        <>
            <Box sx={styles.controlPanel}>
                <Box sx={{
                    ...styles.controlPanelHeader,
                    borderBottomColor: `${open ? headerBorderLeftColor : 'transparent'}`,
                }}>
                    <Box
                        display='flex'
                        alignItems='center'
                        gap='0.25rem'
                        height={1}
                        flex={1}
                        onClick={() => setOpen(!open)}
                        sx={styles.pointer}
                    >
                        <ExpandMoreIcon sx={{
                            ...styles.transition,
                            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
                        }}/>
                        <Typography sx={styles.controlPanelHeaderHeading}>
                            Control panel
                            <Typography sx={styles.controlPanelHeaderSubHeading} component='span'>
                                {Object.keys(activeActivityMaps).length} active statistical maps
                            </Typography>
                        </Typography>
                    </Box>

                    {Object.values(activeActivityMaps).length > 0 &&
                        <CustomSlider min={globalIntensityRange[0]}
                                      max={globalIntensityRange[1]}
                                      value={intensityRange}
                                      width='40%'
                                      heading="Global intensity"
                                      showPercentageAbsolute={true}
                                      onChange={(newValue) => onIntensityChange(newValue)}/>
                    }
                </Box>

                <Box
                    sx={{
                        ...styles.controlPanelBody,
                        maxHeight: !open ? 0 : 300,
                    }}
                >
                    <Table
                        tableHeader={['Actions', 'Name', 'Configure intensity']}
                        tableContent={viewerObjects}
                        onReorder={onReorder}
                    />
                </Box>
            </Box>
        </>
    );
};

export default ControlPanel;