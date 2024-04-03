import {Box, Tooltip, Typography} from "@mui/material";

export const CustomTooltip = ({title, text}) => <Tooltip open={true} title={
  <Box>
    <Typography
      whiteSpace='nowrap'
      variant='h5'
      color='#B1B1B4'
    >
      {title}
    </Typography>
    <Typography
      whiteSpace='nowrap'
      variant='h4'
      color='#FCFCFD'
    >
      {text}
    </Typography>
  </Box>
  
}
>
  <Typography> Statistical maps</Typography>
</Tooltip>