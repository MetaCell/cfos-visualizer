import React, { useEffect, useState } from 'react';
import { Box, Typography, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import Alert from '@mui/material/Alert';
import { Viewer } from './Viewer';
import { useDispatch, useSelector } from "react-redux";
import { fetchModel, setError } from "../redux/actions";
import {SNACKBAR_TIMEOUT} from "../settings";

export const ViewerDashboard = (props) => {

    const dispatch = useDispatch();
    const model = useSelector(state => state.model);
    const isLoading = useSelector(state => state.ui.isLoading);
    const loadingMessage = useSelector(state => state.ui.loadingMessage);
    const error = useSelector(state => state.ui.errors);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        dispatch(fetchModel());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            setOpenSnackbar(true);
            setTimeout(() => {
                setOpenSnackbar(false)
                dispatch(setError(null));
            }, SNACKBAR_TIMEOUT + 1);
        }
    }, [error, dispatch]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>

            {/* Loading backdrop */}
            <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <CircularProgress color="inherit" />
                    <Typography mt={2} variant="h6">{loadingMessage}</Typography>
                </Box>
            </Backdrop>

            {/* Error Snackbar */}
            <Snackbar open={openSnackbar} autoHideDuration={SNACKBAR_TIMEOUT}>
                <Alert severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex' }}>
                {/* Viewer */}
                <Box sx={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    <Viewer />
                </Box>
            </Box>

            {/* Control Panel */}
            <Typography sx={{ flexShrink: 0, backgroundColor: 'lightsalmon', p: 1 }}> Control Panel </Typography>
        </Box>
    );
}
