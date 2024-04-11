import React from 'react';
import {Alert, Collapse, IconButton, Stack, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import variables from "../theme/variables";

const {gray100, gray300, gray700, gray800} = variables
export const MetadataViewer = () =>
{
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Stack
        id='details'
        spacing={'1.5rem'}
         sx={{
         display: 'flex',
         flexDirection: 'column',
         height: '100%',
         width: '100%',
         padding: '1.5rem'
       }}>
        <Collapse in={open}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            icon={false}
            sx={{
              borderRadius: '0.75rem',
              border: `1px solid ${gray700}`,
              background: gray800,
              padding: '1rem'
            }}
          >
            <Stack spacing={'.75rem'}>
              <Typography variant='h4' fontWeight={400} color={gray300}>The selected atlas is associated with this experiment.</Typography>
              <Typography variant='h4' fontWeight={600} color={gray100}>See other associated experiments</Typography>
            </Stack>
          </Alert>
        </Collapse>
      </Stack>
    </>
  )
};
