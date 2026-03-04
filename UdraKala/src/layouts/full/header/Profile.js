import React, { useState } from 'react';
import { Link } from 'react-router';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText, Typography
} from '@mui/material';

import { IconDashboard, IconMail, IconUser } from '@tabler/icons-react';

import ProfileImg from 'src/assets/images/profile/user-1.jpg';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '240px',
            background: 'rgba(17, 25, 40, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            mt: 1,
            boxShadow: (theme) => theme.shadows[8],
          },
        }}
      >
        <Box px={2} py={2}>
          <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 1 }}>User Profile</Typography>
          <Typography variant="body2" color="textSecondary">Administrator</Typography>
        </Box>
        <MenuItem sx={{ py: 1.5 }}>
          <Link to='/form-layouts' style={{ textDecoration: 'none', width: '100%' }}>
            <Box display='flex' alignItems='center'>
              <ListItemIcon sx={{ color: '#7B61FF', minWidth: '35px' }}>
                <IconUser width={20} />
              </ListItemIcon>
              <ListItemText><Typography variant='body1' sx={{ color: '#CBD5E1' }}>My Profile</Typography></ListItemText>
            </Box>
          </Link>
        </MenuItem>
        <MenuItem sx={{ py: 1.5 }}>
          <Link to='/tables/basic-table' style={{ textDecoration: 'none', width: '100%' }}>
            <Box display='flex' alignItems='center'>
              <ListItemIcon sx={{ color: '#00E5FF', minWidth: '35px' }}>
                <IconMail width={20} />
              </ListItemIcon>
              <ListItemText><Typography variant='body1' sx={{ color: '#CBD5E1' }}>Performance</Typography></ListItemText>
            </Box>
          </Link>
        </MenuItem>
        <MenuItem sx={{ py: 1.5 }}>
          <Link to='/dashboard' style={{ textDecoration: 'none', width: '100%' }}>
            <Box display='flex' alignItems='center'>
              <ListItemIcon sx={{ color: '#3B82F6', minWidth: '35px' }}>
                <IconDashboard width={20} />
              </ListItemIcon>
              <ListItemText><Typography variant='body1' sx={{ color: '#CBD5E1' }}>My Dashboard</Typography></ListItemText>
            </Box>
          </Link>
        </MenuItem>
        <Box mt={2} py={2} px={2} borderTop="1px solid rgba(255, 255, 255, 0.1)">
          <Button to="/auth/login" variant="contained" color="primary" component={Link} fullWidth sx={{ borderRadius: '8px' }}>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
