import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Box, /*IconButton,*/ Toolbar, Typography } from '@mui/material';
//import PermIdentityIcon from '@mui/icons-material/PermIdentity';

export const Header: React.FC<{
  isLoggedIn: boolean; 
  onLogout: () => void; 
}> = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

  const handleLogout = () => {
    onLogout(); 
    setLogoutMessage("You have been logged out successfully."); 
    navigate("/"); 
    setTimeout(() => {
      setLogoutMessage(null);
    }, 3000);
  };
  return (
    <AppBar color="default">
      <Toolbar >
        <Box>
      <Typography component={Link} to="/" variant="overline" fontSize={14} 
      sx={{textDecoration: 'none', color: 'inherit', fontWeight: 'bold', flexGrow: 1, marginLeft: 3,}}>
        HOME</Typography>
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'flex-end', marginLeft: 'auto'}}>
        {logoutMessage && ( <Typography variant="body2" color="error" sx={{ marginRight: 2 }}> {logoutMessage}
        </Typography>)}
        {isLoggedIn ? (<>
          {/* <IconButton  component={Link} to="/profile"><PermIdentityIcon /></IconButton > */}
          <Typography component={Link} to="/posts" variant="overline" fontSize={14} 
      sx={{textDecoration: 'none', color: 'inherit', flexGrow: 1, marginRight: 3,}}>
        FEED</Typography>

          <Typography component={Link} to="/profile" variant="overline" fontSize={14} 
      sx={{textDecoration: 'none', color: 'inherit', flexGrow: 1, marginRight: 3,}}>
        PROFILE</Typography>
          <Typography variant="overline" fontSize={14} sx={{textDecoration: 'none', color: 'inherit', cursor: 'pointer', marginRight: 3,}} onClick={handleLogout}>
          LOGOUT</Typography>
          </>) : (
          <Box sx={{display: 'flex', justifyContent: 'flex-end', marginLeft: 'auto'}}>
          <Typography component={Link} to="/register" variant="overline" fontSize={14}
          sx={{textDecoration: 'none', color: 'inherit', cursor: 'pointer', marginRight: 3,}}>
          GET STARTED</Typography>
          <Typography component={Link} to="/login" variant="overline" fontSize={14}
          sx={{textDecoration: 'none', color: 'inherit', cursor: 'pointer', marginRight: 3,}}>
          LOGIN</Typography>
          </Box>
          )}
          </Box>
      </Toolbar>
    </AppBar>
  );
};
