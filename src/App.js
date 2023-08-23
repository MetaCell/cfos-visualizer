import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import logo from './logo.png';

function App() {
  return (
    <div>
      <AppBar position="static" sx={{ background: '#0F0F10'}}>
        <Toolbar>
          <Avatar
            alt="Logo"
            src={logo} // Replace with the actual path to your logo image
            sx={{ width: 101, height: 28, marginRight: 2 }}
          />
          <Typography variant="h6">
            CFOS
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default App;
