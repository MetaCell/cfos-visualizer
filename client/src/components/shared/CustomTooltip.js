import {Box, Tooltip, Typography} from "@mui/material";

export const CustomTooltip = ({title, text, coordinates}) => <Tooltip open={true} title={
  <Box>
    <Typography
      whiteSpace='nowrap'
      variant='body2'
      sx={{
        color: '#B1B1B4',
        fontSize: '0.75rem',
        whiteSpace: 'normal'
      }}
    >
      {title}
    </Typography>
    <Typography
      whiteSpace='nowrap'
      variant='body2'
      sx={{
        color: '#FCFCFD',
        fontSize: '0.875rem',
        fontWeight: '500',
        lineHeight: '1.25rem',
        whiteSpace: 'normal'
      }}
    >
      {text}
    </Typography>
  </Box>
  
}
>
  <Typography> Statistical maps</Typography>
</Tooltip>