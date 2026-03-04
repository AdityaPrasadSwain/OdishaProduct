import React, { useState } from 'react'
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Badge,
  Button,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'

// components
import Profile from './Profile'
import { IconBellRinging, IconMenu } from '@tabler/icons-react'

const Header = (props) => {
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: 'rgba(11, 17, 32, 0.75)',
    justifyContent: 'center',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }))
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: '#94A3B8',
  }))

  // notification dd
  const [anchorEl, setAnchorEl] = useState(null)

  const [menuPosition, setMenuPosition] = useState(null)

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect() // Get exact position
    setMenuPosition({
      top: rect.bottom + window.scrollY, // Position menu below the icon
      left: rect.left + window.scrollX, // Align with icon
    })
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBarStyled position='sticky' color='default'>
      <ToolbarStyled>
        <IconButton
          color='inherit'
          aria-label='menu'
          onClick={props.toggleMobileSidebar}
          sx={{
            display: {
              lg: 'none',
              xs: 'inline',
            },
            color: '#F8FAFC',
          }}>
          <IconMenu width='24' height='24' />
        </IconButton>

        <Box flexGrow={1} />

        <Stack spacing={2} direction='row' alignItems='center'>
          <IconButton
            aria-label='show notifications'
            color='inherit'
            aria-controls='notification-menu'
            aria-haspopup='true'
            onClick={handleClick}
            sx={{ color: '#94A3B8', '&:hover': { color: '#7B61FF' } }}>
            <Badge variant='dot' color='primary'>
              <IconBellRinging size='24' stroke='1.5' />
            </Badge>
          </IconButton>

          <Menu
            id='notification-menu'
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorReference='anchorPosition' // Use custom positioning
            anchorPosition={
              menuPosition
                ? { top: menuPosition.top, left: menuPosition.left }
                : undefined
            }
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  background: 'rgba(17, 25, 40, 0.95)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: (theme) => theme.shadows[8],
                  minWidth: '250px',
                  borderRadius: '12px',
                },
              },
            }}>
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <Typography variant='body2'>New product arrival!</Typography>
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <Typography variant='body2'>Your order has been shipped.</Typography>
            </MenuItem>
          </Menu>

          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  )
}

Header.propTypes = {
  sx: PropTypes.object,
}

export default Header
