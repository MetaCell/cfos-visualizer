import Box from '@mui/material/Box';
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss'
import {CssBaseline} from '@mui/material';
import 'font-awesome/css/font-awesome.min.css';
import './css/main.css';
import MainLayout from './pages/HomePage';
import {Header} from "./components/shared/header";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import { fetchModel } from "./redux/actions";


function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchModel());
    }, []);


    return (
        <>
            <CssBaseline />
            <Header />
            <Box p={1.5} sx={{height: 'calc(100vh - 2.75rem)'}}>
                <MainLayout/>
            </Box>
        </>
    );
}

export default App;
