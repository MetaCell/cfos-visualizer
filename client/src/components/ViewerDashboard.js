import React, { useState } from 'react';
import { Box, Button, Divider, IconButton, Slider, Typography } from "@mui/material";
import { Viewer } from './Viewer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GrainIcon from '@mui/icons-material/Grain';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import vars from '../theme/variables';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const {
    headerBorderLeftColor,
    resetButtonColor,
    accordianTextColor,
    labelColor,
    headingColor,
    headerBorderColor,
    headerButtonColor,
    resetButtonActiveColor
} = vars

export const ViewerDashboard = ( props ) =>
{
    const [ open, setOpen ] = useState( true );
    const [ value, setValue ] = React.useState( 30 );

    const handleChange = ( event, newValue ) =>
    {
        setValue( newValue );
    };

    const experiments = [
        {
            name: 'c-Fos__avg__saline.nii.gz',
            description: 'from external experiment - Comparative Analysis of Mouse Brain c-Fos-IF Expression under LSD and DMT'
        },
        {
            name: 'c-Fos__avg__saline.nii.gz',
            description: 'from external experiment - Comparative Analysis of Mouse Brain c-Fos-IF Expression under LSD and DMT'
        },
        {
            name: 'c-Fos__avg__saline.nii.gz',
            description: 'from external experiment - Comparative Analysis of Mouse Brain c-Fos-IF Expression under LSD and DMT'
        },
        {
            name: 'c-Fos__avg__saline.nii.gz',
            description: 'from external experiment - Comparative Analysis of Mouse Brain c-Fos-IF Expression under LSD and DMT'
        },
    ]

    const colorPaletteExampleColors = ['#3939A1', '#8A3535', '#475467', headerBorderLeftColor]
    return (
        <Box sx={ { display: 'flex', flexDirection: 'column', height: '100%', width: '100%' } }>

            <Box sx={ { flex: 1, display: 'flex' } }>
                <Box sx={ { flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' } }>
                    <Viewer />
                </Box>
            </Box>

            {/* Control Panel */ }
            <Box sx={ {
                borderRadius: '0.5rem 0.5rem 0 0',
                border: '0.0625rem solid rgba(48, 47, 49, 0.60)',
                background: 'linear-gradient(0deg, rgba(30, 30, 31, 0.60) 0%, rgba(30, 30, 31, 0.60) 100%), #0F0F10'
            } }>
                <Box sx={ {
                    height: '2.75rem',
                    pl: 1.5,
                    pr: 3,
                    display: 'flex',
                    userSelect: 'none',
                    alignItems: 'center',
                    borderBottom: `0.0625rem solid ${ open ? headerBorderLeftColor : 'transparent' }`,
                } }>
                    <Box height={ 1 } flex={ 1 } onClick={ () => setOpen( !open ) } sx={ {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        cursor: 'pointer'
                    } }>
                        <ExpandMoreIcon sx={ {
                            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
                            transition: 'all ease-in-out .3s'
                        } } />
                        <Typography sx={ {
                            color: headingColor,
                            fontSize: '0.875rem',
                            fontWeight: 400,
                            lineHeight: '142.857%',
                        } }>
                            Control panel
                            <Typography sx={ {
                                color: accordianTextColor,
                                marginLeft: 1,
                                fontSize: '0.75rem',
                                fontWeight: 400,
                                lineHeight: '150%',
                            } } component='span'>3 active statistical maps</Typography>
                        </Typography>
                    </Box>

                    <Box sx={{width: '30%'}} display='flex' alignItems='center' gap={1}>
                        <Typography whiteSpace='nowrap' variant='body2' sx={ { color: labelColor, fontSize: '0.75rem' } }>Global intensity</Typography>
                        <Slider value={ value } onChange={ handleChange } />
                        <Button disableRipple sx={ {
                            '&.MuiButton-text': {
                                textTransform: 'none !important',
                                color: resetButtonColor,
                                padding: 0,
                                fontSize: '0.75rem',
                                flexShrink: 0,
                                lineHeight: '150%',
                                fontWeight: 400,
                                minWidth: '0.0625rem'
                            },
                        } }>Reset</Button>
                    </Box>
                </Box>


                <Box sx={ {
                    px: 1.5,
                    overflow: 'auto',
                    transition: 'all 0.3s ease-in-out',
                    maxHeight: !open ? 0 : 300,
                } }>
                    <Box sx={ {
                        pb: 1.5,
                        '& .head': {
                            display: 'flex',
                            p: '0.75rem 0 0.5rem',
                            '& > .MuiBox-root': {
                                width: 'calc(65% - 5.625rem)',
                                px: '0.75rem',
                                '& + .MuiBox-root': {
                                    borderLeft: `0.0625rem solid ${headerBorderLeftColor}`
                                },
                                '&:first-of-type': {
                                    width: '11.25rem'
                                },
                                '&:last-of-type': {
                                    width: 'calc(35% - 5.625rem)'
                                },
                            },
                            '& .MuiTypography-root': {
                                color: accordianTextColor,
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                lineHeight: '150%',
                            }
                        },

                        '& .body': {
                            '& .row': {
                                p: '0.375rem 0',
                                display: 'flex',
                                borderRadius: '0.5rem',
                                border: '0.0625rem solid transparent',


                                '& .MuiIconButton-root': {
                                    padding: '0.375rem'
                                },

                                '& .MuiTypography-body1': {
                                    color: headerButtonColor,
                                    fontSize: '0.875rem',
                                    fontWeight: 400,
                                    lineHeight: '142.857%',
                                },
                                '& .MuiTypography-body2': {
                                    color: accordianTextColor,
                                    fontSize: '0.75rem',
                                    fontWeight: 400,
                                    lineHeight: '150%',
                                },
                                '& .ellipses': {
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                },

                                '&.secondary': {
                                    mt: 1,
                                    padding: '0.75rem',
                                },

                                '& > .MuiBox-root': {
                                    display: 'flex',
                                    alignItems: 'center',
                                    minWidth: 0,
                                },

                                '&:not(.secondary)': {
                                    '&:hover': {
                                        background: headerBorderColor,
                                        borderColor: headerBorderLeftColor,
                                    },
                                    '& > .MuiBox-root': {
                                        width: 'calc(65% - 5.625rem)',
                                        gap: '0.5rem',
                                        px: '0.75rem',

                                        '&:first-of-type': {
                                            width: '11.25rem'
                                        },
                                        '&:last-of-type': {
                                            width: 'calc(35% - 5.625rem)'
                                        },
                                        '& + .MuiBox-root': {
                                            borderLeft: `0.0625rem solid ${headerBorderLeftColor}`
                                        },
                                    },
                                },


                            },
                            '& .MuiTypography-root': {
                                color: accordianTextColor,
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                lineHeight: '150%',
                            }
                        },
                    } }>
                        <Box className="head">
                            <Box>
                                <Typography>Actions</Typography>
                            </Box>
                            <Box>
                                <Typography>Name</Typography>
                            </Box>
                            <Box>
                                <Typography>Configure intensity</Typography>
                            </Box>
                        </Box>
                        <Box className="body">
                            { experiments.map( (experiment, index) => <Box key={`experiment_${index}`} className="row">
                                <Box sx={ { gap: '0.25rem !important' } }>
                                    <IconButton>
                                        <DragIndicatorIcon sx={ { color: headerButtonColor, fontSize: '1rem' } } />
                                    </IconButton>
                                    <IconButton disabled={index === experiments.length - 1}>
                                        <RemoveCircleOutlineIcon sx={ { color: headerButtonColor, fontSize: '1rem' } } />
                                    </IconButton>
                                    <Divider sx={ { background: headerBorderLeftColor, width: '0.0625rem', height: '100%' } } />
                                    <IconButton>
                                        <VisibilityOutlinedIcon sx={ { color: headerButtonColor, fontSize: '1rem' } } />
                                    </IconButton>
                                    <IconButton disabled={index === experiments.length - 1}>
                                        <ColorLensOutlinedIcon sx={ { color: colorPaletteExampleColors[index], fontSize: '1rem' } } />
                                    </IconButton>
                                    <IconButton>
                                        <DownloadOutlinedIcon sx={ { color: headerButtonColor, fontSize: '1rem' } } />
                                    </IconButton>
                                </Box>
                                <Box>
                                    <GrainIcon sx={ { color: headerButtonColor, fontSize: '1rem' } } />
                                    <Typography variant='body1'>
                                       {experiment?.name}
                                    </Typography>
                                    <Typography variant='body2' className='ellipses'>
                                        {experiment?.description}
                                    </Typography>
                                </Box>
                                <Box sx={ { gap: '0.75rem !important' } }>
                                    <Typography variant='body2' sx={ { color: labelColor } }>Intensity</Typography>
                                    <Slider value={ value } onChange={ handleChange } />
                                    <Button disableRipple sx={ {
                                        '&.MuiButton-text': {
                                            textTransform: 'none !important',
                                            color: resetButtonActiveColor,
                                            padding: 0,
                                            fontSize: '0.75rem',
                                            flexShrink: 0,
                                            lineHeight: '150%',
                                            fontWeight: 400,
                                            minWidth: '0.0625rem'
                                        },
                                    }}>Reset</Button>
                                </Box>
                            </Box>
                            )}

                            <Box className="row secondary" justifyContent='space-between' sx={{ background: headerBorderColor , border: `0.0625rem solid ${headerBorderLeftColor}`}}>
                                <Typography variant='body2' className='ellipses'>
                                    No active statistical maps
                                </Typography>
                                <Button disableRipple sx={ {
                                    '&.MuiButton-text': {
                                        textTransform: 'none !important',
                                        color: resetButtonActiveColor,
                                        padding: 0,
                                        fontSize: '0.875rem',
                                        flexShrink: 0,
                                        lineHeight: '143%',
                                        fontWeight: 600,
                                        gap: '0.5rem',
                                        minWidth: '0.0625rem'
                                    },
                                } }>
                                    Add statistical map(s) to viewer
                                    <ArrowForwardIcon sx={{fontSize: '1.25rem'}} />
                                </Button>
                            </Box>
                        </Box>

                    </Box>
                </Box>

            </Box>
            {/* <Typography sx={{ flexShrink: 0, backgroundColor: 'lightsalmon', p: 1 }}> Control Panel </Typography> */ }
        </Box>
    );
};