import {Box, Typography} from "@mui/material";
import React from "react";
import vars from "../theme/variables";
import TableRow from "./TableRow";

const {
    headerBorderLeftColor,
    accordianTextColor,
    headerBorderColor,
    headerButtonColor,
    resetButtonActiveColor
} = vars;

export const tableStyles = {
    head: {
        display: 'flex',
        p: '0.75rem 0 0.5rem',

        '& > .MuiBox-root': {
            width: 'calc(65% - 5.625rem)',
            px: '0.75rem',
            '& + .MuiBox-root': {
                borderLeft: `0.0625rem solid ${headerBorderLeftColor}`
            },
            '&:first-of-type': {
                width: '13.25rem'
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

    root: {
        p: '0.375rem 0',
        display: 'flex',
        borderRadius: '0.5rem',
        border: '0.0625rem solid transparent',

        '& .MuiLink-root': {
            color: resetButtonActiveColor,
            gap: '0.5rem',
            fontSize: '0.875rem',
            flexShrink: 0,
            lineHeight: '142.857%',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center'
        },

        '& .MuiIconButton-root': {
            padding: '0.375rem',

            '& .MuiSvgIcon-root': {
                fontSize: '1rem'
            },

            '&:not(.Mui-disabled)': {
                '& .MuiSvgIcon-root': {
                    color: headerButtonColor,
                }
            }
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
                    width: '13.25rem'
                },
                '&:last-of-type': {
                    width: 'calc(35% - 5.625rem)'
                },
                '& + .MuiBox-root': {
                    borderLeft: `0.0625rem solid ${headerBorderLeftColor}`
                },
            },
        },
    }
};

const Table = ({tableHeader, tableContent}) => {
    const hasNoActivityMaps = tableContent.length < 2
    return (
        <Box pb={1.5}>
            <Box sx={tableStyles.head}>
                {tableHeader?.map((head, index) => (
                    <Box key={index}>
                        <Typography>{head}</Typography>
                    </Box>
                ))}
            </Box>

            <Box sx={tableStyles.body}>
                {tableContent?.map((row, index) =>
                    <TableRow key={row.id} data={row} index={index} isAtlas={index === tableContent?.length - 1}/>)
                }
                {
                    hasNoActivityMaps &&
                    <Box className="secondary" justifyContent='space-between'
                         sx={{
                             ...tableStyles.root,
                             background: headerBorderColor,
                             border: `0.0625rem solid ${headerBorderLeftColor}`
                         }}>
                        <Typography variant='body2' className='ellipses'>
                            No active statistical maps
                        </Typography>
                        {/*TODO: Uncomment when we have the experiment details*/}
                        {/*<Link href='#' underline='none' disabled>*/}
                        {/*    Add statistical map(s) to viewer*/}
                        {/*    <ArrowForwardIcon sx={{fontSize: '1.25rem'}}/>*/}
                        {/*</Link>*/}
                    </Box>
                }
            </Box>
        </Box>
    )
};

export default Table;