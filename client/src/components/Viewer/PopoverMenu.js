import React from 'react';
import {
    Badge, Box, Button, Chip, Divider, FormControlLabel, FormGroup, Popover, Switch, Typography
} from "@mui/material";
import vars from "../../theme/variables";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const {primaryActiveColor, headerBorderColor, headerBg, headerButtonColor, headerBorderLeftColor, headingColor} = vars;

const PopoverMenu = ({
    isOpen,
    handlePopoverClose,
    orderedExperiments,
    experimentsActivityMaps,
    currentExperiment,
    activityMapsMetadata,
    dispatch,
    fetchAndAddActivityMapToViewer,
    removeActivityMapFromViewer,
    activeActivityMaps,
    anchorEl,
    handlePopoverOpen, 
}) => {
    const popoverID = isOpen ? 'simple-popover' : undefined;

    return (
        <>
            <Badge badgeContent={activeActivityMaps.length} color="primary">
                <Button sx={{
                    '&.MuiButton-root': {
                        position: 'absolute',
                        right: '0.75rem',
                        height: '2.25rem',
                        borderRadius: '0.5rem',
                        border: `0.0625rem solid ${activeActivityMaps.length > 0}`,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        background: headerBg,
                        boxShadow: '0rem 0.0625rem 0.125rem 0rem rgba(16, 24, 40, 0.05)',
                        top: '0.75rem',
                        zIndex: 9,
                        gap: '0.5rem',
                        '&:hover': {
                            background: headerBorderColor
                        }
                    }
                }
                } aria-describedby={popoverID} variant="contained" onClick={handlePopoverOpen} disableRipple>
                    Statistical maps
                    <KeyboardArrowDownIcon sx={{fontSize: '1.25rem', color: headerButtonColor}}/>
                </Button>
            </Badge>
            <Popover
                id={popoverID}
                sx={{ maxHeight: '20rem' }}
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom', horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'tPopoverop', horizontal: 'right',
                }}
            >
                <Box px={2} pt={1.25}>
                    {orderedExperiments.map((experimentName, experimentIndex) => {
                        const experimentActivityMaps = experimentsActivityMaps[experimentName] || [];
                        return (<Box key={experimentName}>
                            {experimentIndex !== 0 &&
                                <Divider sx={{mt: 1.5, mb: 1, background: headerBorderLeftColor}}/>}
                            <Box sx={{
                                height: '1.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: headerBorderColor,
                                '& .MuiTypography-root': {
                                    fontSize: '0.75rem', fontWeight: 400, lineHeight: '150%', color: headingColor
                                }
                            }}>
                                <Typography>{experimentName}</Typography>
                                {experimentIndex === 0 && currentExperiment && <Chip label="Current Experiment"/>}
                            </Box>
                            <FormGroup>
                                {experimentActivityMaps.map((activityMapID, mapIndex) => (
                                    <Box key={activityMapID} sx={{
                                        position: 'relative', paddingLeft: '0.25rem', '&:hover': {
                                            '&:before': {
                                                background: primaryActiveColor,
                                            }
                                        }, '&:before': {
                                            content: '""',
                                            height: '100%',
                                            width: '0.125rem',
                                            background: headerBorderColor,
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                        },
                                    }}>
                                        <FormControlLabel
                                            key={activityMapID}
                                            control={
                                                <Switch
                                                    checked={!!activeActivityMaps[activityMapID]}
                                                    onChange={(event) => {
                                                        if (event.target.checked) {
                                                            dispatch(fetchAndAddActivityMapToViewer(activityMapID));
                                                            handlePopoverClose()
                                                        } else {
                                                            dispatch(removeActivityMapFromViewer(activityMapID));
                                                        }
                                                    }}
                                                />}
                                            labelPlacement="start"
                                            label={activityMapsMetadata[activityMapID]?.name}
                                        />
                                    </Box>))}
                            </FormGroup>
                        </Box>)
                    })}
                </Box>
            </Popover>
        </>
    );
};

export default PopoverMenu;