import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const Layout = ({ children }) => {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                        Quiz App
                    </Typography>
                    <Box>
                        {user ? (
                            <>
                                <Button color="inherit" component={RouterLink} to="/profile">
                                    <PersonIcon sx={{ mr: 1 }} />
                                    Profile
                                </Button>
                                <Button color="inherit" onClick={handleLogout}>
                                    <LogoutIcon sx={{ mr: 1 }} />
                                    Logout
                                </Button>
                                <Avatar sx={{ ml: 2 }}>
                                    {user.name ? user.name[0] : 'U'}
                                </Avatar>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={RouterLink} to="/login">
                                    Login
                                </Button>
                                <Button color="inherit" component={RouterLink} to="/register">
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Box sx={{ mt: 8, mb: 4 }}>
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
