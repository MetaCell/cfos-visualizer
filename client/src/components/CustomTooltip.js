import {Box, Tooltip, Typography} from "@mui/material";
import variables from "../theme/variables";
const {gray200} = variables

export const CustomTooltip = ({open, text, anchorPosition}) => {
    return (
        <Tooltip
            key={`${anchorPosition.x}-${anchorPosition.y}`}
            sx={{position: 'absolute', left: anchorPosition.x, top: anchorPosition.y, zIndex: 9999999}}
            open={open}
            title={
                <Box>
                    <Typography
                        whiteSpace='nowrap'
                        variant='h5'
                        color={gray200}
                    >
                        {text}
                    </Typography>
                </Box>
            }
        >
            <Typography/>
        </Tooltip>
    );
};

