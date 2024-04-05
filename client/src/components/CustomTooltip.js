import { Box, Tooltip, Typography } from "@mui/material";

export const CustomTooltip = ({ open, text, anchorPosition }) => {
    return (
        <Tooltip
            key={`${anchorPosition.x}-${anchorPosition.y}`}
            sx={{ position: 'absolute', left: anchorPosition.x, top: anchorPosition.y, zIndex: 9999999 }}
            open={open}
            title={
                <Box>
                    <Typography whiteSpace='nowrap' variant='h4' color='#FCFCFD'>
                        {text}
                    </Typography>
                </Box>
            }
        >
            <Typography />
        </Tooltip>
    );
};

