import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Box, IconButton, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import variables from "../../theme/variables";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import {Details} from "./Details";
import {fetchAndSetExperimentAndAtlas} from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
const {gray400, gray600, gray100, gray700} = variables
const ExperienceDetailsDialog = ({open, handleClose, experiment, name}) =>{
  const experimentAtlas = useSelector(state => state.model.ExperimentsAtlas);
  const dispatch = useDispatch();
  const handleClickExperiment = (e) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(fetchAndSetExperimentAndAtlas(name, experimentAtlas[name][0]))
    handleClose()
  }
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        PaperProps={{
          sx: {
            minWidth: '64rem',
            maxWidth: '64rem',
            minHeight: '30rem'
          }
        }}
      >
        <Box sx={{
          borderBottom: `1px solid ${gray600}`,
          padding: '0.75rem 1.5rem'
        }}>
          <Box  sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '.25rem'
          }}>
            <ArticleOutlinedIcon sx={{
              fontSize: '1.25rem',
              color: gray100,
              marginRight: '.50rem'
            }} />
            <DialogTitle id="scroll-dialog-title" color='#FCFCFD' variant='h4' margin={0} padding={'0 !important'}>
              {name}
            </DialogTitle>
            <IconButton onClick={handleClickExperiment}>
              <ArrowForwardIcon sx={{
                fontSize: '1.25rem',
                color: gray100
              }} />
            </IconButton>
          </Box>
         
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              right: 8,
              top: 8,
              '&.MuiButtonBase-root': {
                position: 'absolute',
                color: gray400,
                fontSize: '1.25rem'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <DialogContent sx={{
          padding: 0
        }}>
            <Box sx={{
              borderBottom: `1px solid ${gray600}`,
              padding: '0.75rem 1.5rem',
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: gray700
            }}>
              <Typography variant='h4' color={gray100}>Details</Typography>
            </Box>
            <Box sx={{
              padding: '0.75rem 1.5rem'
            }}>
              <Details experiment={experiment} />
            </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default ExperienceDetailsDialog