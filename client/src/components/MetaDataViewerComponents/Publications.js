import {Box, Chip, Divider, Link, Stack, Typography} from "@mui/material";
import variables from "../../theme/variables";
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded';
const { gray25, gray200, gray100} = variables

export const Publications = ({title, value}) => {
  return <Stack spacing='.75rem'>
    <Typography variant='h4' fontWeight={400} color={gray25}>{title}</Typography>
    {value.map((v, i) => <>
      {
        v.description && <Typography variant='h4' fontWeight={400} color={gray200}>
          {v.description}
        </Typography>
      }
      
      {v.link && <Box key={i} sx={{
        padding: '.75rem 1rem',
        gap: '.75rem',
        display: 'flex',
        alignItems: 'center',
        borderRadius: ' 0.5rem',
        border: '1px solid rgba(48, 47, 49, 0.60)',
        background: 'rgba(30, 30, 31, 0.60)'
      }}>
        <Link href={v.link} target='_blank' sx={{
          color: gray100,
          textDecorationColor: gray100,
        }}><InsertLinkRoundedIcon/></Link>
        <Typography variant='h4' fontWeight={400} color={gray200}>{v.label}</Typography>
      </Box>}
      {
        v.keywords &&  <Typography variant='h4' fontWeight={400} color={gray200}>
          {v.keywords}
        </Typography>
      }
     
      {
        v.tags.length !== 0 && <>
          <Divider sx={{mt: '1.5rem !important'}} />
          <Stack direction='row' spacing='.5rem' mt='1.5rem !important'>
            {
              v.tags.map(tag => <Chip label={tag} sx={{ width: 'fit-content', borderRadius: '0.5rem', '& .MuiChip-label': {padding: '0.125rem 0.625rem'} }} />)
            }
          </Stack>
        </>
      }
    </>)}
  
  </Stack>
}