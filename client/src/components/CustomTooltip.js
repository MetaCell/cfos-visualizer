import {Box, Tooltip, Typography} from "@mui/material";
import variables from "../theme/variables";
const {gray200, gray25} = variables

export const CustomTooltip = ({title, text}) => <Tooltip open={true} title={
  <Box>
    <Typography
      whiteSpace='nowrap'
      variant='h5'
      color={gray200}
    >
      {title}
    </Typography>
    <Typography
      whiteSpace='nowrap'
      variant='h4'
      color={gray25}
    >
      {text}
    </Typography>
  </Box>
  
}
>
  <Typography> Statistical maps</Typography>
</Tooltip>