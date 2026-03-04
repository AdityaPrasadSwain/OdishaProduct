import { useMediaQuery, Box, Drawer } from '@mui/material';
import SidebarItems from './SidebarItems';
import Scrollbar from "../../../components/custom-scroll/Scrollbar";
import Upgrade from './Upgrade'

const Sidebar = (props) => {

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const sidebarWidth = '270px';



  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Drawer
          anchor="left"
          open={props.isSidebarOpen}
          variant="permanent"
          slotProps={{
            paper: {
              sx: {
                width: sidebarWidth,
                boxSizing: 'border-box',
                top: '0',
                height: '100%',
                background: 'rgba(17, 25, 40, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: 'none',
              },
            }
          }}
        >
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Scrollbar sx={{ height: "calc(100% - 73px)" }}>
            <Box>
              {/* ------------------------------------------- */}
              {/* Sidebar Items */}
              {/* ------------------------------------------- */}
              <SidebarItems />
            </Box>
          </Scrollbar>
        </Drawer >
      </Box >
    );
  }
  return (
    <Drawer
      anchor="left"
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      variant="temporary"
      slotProps={{
        paper: {
          sx: {
            width: sidebarWidth,
            background: 'rgba(17, 25, 40, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: (theme) => theme.shadows[8],
          },
        }
      }}
    >
      <Scrollbar sx={{ height: "calc(100% - 73px)" }}>
        {/* ------------------------------------------- */}
        {/* Sidebar For Mobile */}
        {/* ------------------------------------------- */}
        <SidebarItems />
      </Scrollbar>
      <Upgrade />
    </Drawer>
  );
};
export default Sidebar;
