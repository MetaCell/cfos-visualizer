import Box from '@mui/material/Box';
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss'
import {CssBaseline} from '@mui/material';
import MainLayout from './pages/HomePage';
import { Header } from './shared/header';
import 'font-awesome/css/font-awesome.min.css';
import './css/main.css';
import {BASE_URL} from "./settings";
import {useEffect} from "react";


function App() {

    useEffect(() => {
        // Get server URL from environment variables
        console.log(BASE_URL)
        // Fetch data from server
        fetch(BASE_URL)
            .then(response => response.json())
            .then(data => {
                console.log("Data from server:", data);
            })
            .catch(error => {
                console.error("Error fetching data from server:", error);
            });
    }, []);  //

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
