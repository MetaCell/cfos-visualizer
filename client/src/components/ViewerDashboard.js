import React, {useEffect, useState} from 'react';
import {Alert, Backdrop, Box, Snackbar, Typography} from "@mui/material";
import { Viewer } from './Viewer';
import ControlPanel from './ControlPanel';
import {useDispatch, useSelector} from "react-redux";
import {SNACKBAR_TIMEOUT} from "../settings";
import {setError} from "../redux/actions";
import CircularProgress from "@mui/material/CircularProgress";

export const ViewerDashboard = () =>
{
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.ui.isLoading);
    const loadingMessage = useSelector(state => state.ui.loadingMessage);
    const error = useSelector(state => state.ui.errors);
    const [openSnackbar, setOpenSnackbar] = useState(false);

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
        <>
            <Box id='darioVisual'
                sx={ { display: 'flex', flexDirection: 'column', height: '100%', width: '100%' } }
            >

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

                <Box sx={ { flex: 1, display: 'flex' } }>
                    <Box sx={ { flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' } }>
                        <Viewer />
                    </Box>
                </Box>

                {/* Control Panel */ }
                <ControlPanel />
            </Box>
        </>
    );
};
