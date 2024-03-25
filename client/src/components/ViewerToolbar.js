import React from 'react';
import { IconButton, Stack, Tooltip } from "@mui/material";
import vars from '../theme/variables';


export const ViewerToolbar = ({options}) => {

    return (
        <Stack spacing={0.5} sx={{
            '& .MuiIconButton-root': {
                padding: '0.25rem',
                '&:hover': {
                    backgroundColor: vars.headerBorderColor,
                    borderRadius: '0.5rem'
                }
            },
            '& .MuiSvgIcon-root': {
                width: 'auto',
                height: 'auto'
            }
        }}>
            {
                options.map((option) => option.isVisible && (
                    <Tooltip key={option.title} title={option.title} placement="right">
                        <IconButton onClick={option.onClickFunc}>
                            {option.Icon}
                        </IconButton>
                    </Tooltip>
                ))
            }
        </Stack>
    );
}