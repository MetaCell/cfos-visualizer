import React from 'react';
import {Alert, Button, Collapse, IconButton, Stack, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import variables from "../../theme/variables";

const {gray100, gray300, gray700, gray800, gray400} = variables
export const CustomAlert = ({viewOtherExperiences, open, setOpen}) =>
{
  return (
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
            <CloseIcon
              sx={{
                color: gray400,
                fontSize: '1.25rem'
            }} />
          </IconButton>
        }
        icon={false}
        sx={{
          borderRadius: '0.75rem',
          border: `1px solid ${gray700}`,
          background: gray800,
          padding: '1rem',
          
          '&.MuiPaper-root': {
            backgroundColor: 'transparent',
          }
        }}
      >
        <Stack spacing={'.75rem'}>
          <Typography variant='h4' fontWeight={400} color={gray300}>The selected atlas is associated with this experiment.</Typography>
          <Button onClick={viewOtherExperiences} variant='text' fullWidth={false} sx={{
            '&.MuiButton-text': {
              padding: '0',
              width: 'fit-content',
              textTransform: 'none',
            }
          }}>
            <Typography variant='h4' fontWeight={600} color={gray100}>See other associated experiments</Typography>
          </Button>
        </Stack>
      </Alert>
    </Collapse>
  )
};
