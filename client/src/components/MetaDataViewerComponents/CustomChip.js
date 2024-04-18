import {Chip} from "@mui/material";

export const CustomChip = ({text}) =>   <Chip sx={{
  borderRadius: '0.5rem',
  width: 'fit-content',
  
  '& .MuiChip-label': {
    padding: '0.125rem 0.625rem',
    lineHeight: '1.25rem'
  }
}} label={text} />
