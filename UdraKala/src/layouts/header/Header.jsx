import { useState } from 'react';
import { Menu as LucideMenu, Sun, Moon, Search, User, ShoppingCart } from 'lucide-react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import udraKalaLogo from '../../assets/logo.jpg';
import NotificationBell from '../../components/common/NotificationBell';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const { cart } = useData();

    // Determine dashboard path based on role
    const getDashboardPath = () => {
        if (user?.roles?.includes('ROLE_ADMIN')) return '/admin/dashboard';
        if (user?.roles?.includes('ROLE_SELLER')) return '/seller/dashboard';
        return '/customer/dashboard';
    };

    // Determine analytics path (Admin has specific one, others might point to dashboard or placeholder)
    const getAnalyticsPath = () => {
        if (user?.roles?.includes('ROLE_ADMIN')) return '/admin/analytics';
        // For others, we can point to dashboard or keep it distinct if routes existed.
        // User asked for "Analytics" button specifically.
        return '/admin/analytics'; // Fallback or adjust if needed.
    };

    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 h-16 flex items-center justify-between transition-colors duration-300">

            {/* Left Side: Logo/Search */}
            <div className="flex items-center gap-8">
                {/* Logo - acting as home/dashboard link */}
                <a href={getDashboardPath()} className="text-xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-2">
                    <img src={udraKalaLogo} alt="UdraKala" className="h-8 w-8 rounded-full object-cover" />
                    UdraKala
                </a>
            </div>

            {/* Right Side: Navigation & Actions */}
            <div className="flex items-center gap-6">

                {/* Navigation Links (Desktop) */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <a href={getDashboardPath()} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                        Dashboard
                    </a>
                    <a href={getAnalyticsPath()} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                        Analytics
                    </a>
                    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                        Settings
                    </a>
                </nav>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Notifications */}
                    <NotificationBell />

                    {/* Profile & Account Menu */}
                    {/* Integrated Account Menu Logic directly here */}
                    {(() => {
                        const [anchorEl, setAnchorEl] = useState(null);
                        const open = Boolean(anchorEl);
                        const handleClick = (event) => setAnchorEl(event.currentTarget);
                        const handleClose = () => setAnchorEl(null);

                        return (
                            <>
                                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                    <Tooltip title="Account settings">
                                        <IconButton
                                            onClick={handleClick}
                                            size="small"
                                            sx={{ ml: 2 }}
                                            aria-controls={open ? 'account-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                        >
                                            <div className={`h-8 w-8 rounded-full ${user?.profileImage ? '' : 'bg-primary/10'} flex items-center justify-center text-primary font-bold overflow-hidden border border-gray-200 dark:border-gray-700`}>
                                                {user?.profileImage ?
                                                    <img src={user.profileImage} alt="User" className='w-full h-full object-cover' />
                                                    : <User size={18} />
                                                }
                                            </div>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Menu
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    open={open}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    slotProps={{
                                        paper: {
                                            elevation: 0,
                                            sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                mt: 1.5,
                                                bgcolor: theme === 'dark' ? '#1f2937' : 'background.paper', // Dark mode fix
                                                color: theme === 'dark' ? 'white' : 'inherit',
                                                '& .MuiAvatar-root': {
                                                    width: 32,
                                                    height: 32,
                                                    ml: -0.5,
                                                    mr: 1,
                                                },
                                                '&::before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 14,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: theme === 'dark' ? '#1f2937' : 'background.paper', // Match arrow color
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem onClick={() => { handleClose(); window.location.href = '#'; }}>
                                        <Avatar sx={{ width: 28, height: 28, bgcolor: 'transparent', mr: 1 }} />
                                        {user?.name || "Profile"}
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={() => { handleClose(); window.location.href = getDashboardPath(); }}>
                                        <ListItemIcon>
                                            <Settings fontSize="small" sx={{ color: theme === 'dark' ? 'white' : 'inherit' }} />
                                        </ListItemIcon>
                                        Dashboard
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleClose(); logout(); }}>
                                        <ListItemIcon>
                                            <Logout fontSize="small" sx={{ color: theme === 'dark' ? 'white' : 'inherit' }} />
                                        </ListItemIcon>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        );
                    })()}
                </div>
            </div>
        </header>
    );
};

export default Header;
