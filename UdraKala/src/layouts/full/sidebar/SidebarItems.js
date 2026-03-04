
import React from "react";
import { useLocation, NavLink, Link } from 'react-router';
import { Box, Typography } from "@mui/material";
import {
  Logo,
  Sidebar as MUI_Sidebar,
  Menu,
  MenuItem,
  Submenu,
} from "react-mui-sidebar";
import { IconPoint } from '@tabler/icons-react';
import { AdminMenuItems, SellerMenuItems, BuyerMenuItems } from "./MenuItems";
import logoicn from "../../../assets/images/logos/dark1-logo.svg";

const renderMenuItems = (items, pathDirect) => {
  return items.map((item) => {
    const Icon = item.icon ? item.icon : IconPoint;
    const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

    if (item.subheader) {
      return (
        <Box sx={{ margin: "0 -24px", textTransform: 'uppercase' }} key={item.subheader}>
          <Menu subHeading={item.subheader} key={item.subheader} />
        </Box>
      );
    }

    if (item.children) {
      return (
        <Submenu
          key={item.id}
          title={item.title}
          icon={itemIcon}
          borderRadius='7px'
        >
          {renderMenuItems(item.children, pathDirect)}
        </Submenu>
      );
    }

    return (
      <MenuItem
        key={item.id}
        isSelected={pathDirect === item?.href}
        borderRadius='7px'
        icon={itemIcon}
        component="div"
        link={item.href && item.href !== "" ? item.href : undefined}
        target={item.href && item.href.startsWith("https") ? "_blank" : "_self"}
        badge={item.chip ? true : false}
        badgeContent={item.chip || ""}
        badgeColor='secondary'
        badgeTextColor="#1b84ff"
        disabled={item.disabled}
      >
        <Link
          to={item.href}
          target={item.href.startsWith("https") ? "_blank" : "_self"}
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit', width: '100%', display: 'block' }}
        >
          <Typography component='span' sx={{
            color: pathDirect === item?.href ? '#fff' : 'inherit',
            fontWeight: pathDirect === item?.href ? 700 : 500
          }}>
            {item.title}
          </Typography>
        </Link>
      </MenuItem>
    );
  });
};

const SidebarItems = () => {
  const location = useLocation();
  const pathDirect = location.pathname;

  // Logic to determine role (MOCKED for now, typically from AuthContext)
  // Options: 'ADMIN', 'SELLER', 'BUYER'
  const userRole = localStorage.getItem('userRole') || 'SELLER';

  let currentMenu;
  switch (userRole) {
    case 'ADMIN':
      currentMenu = AdminMenuItems;
      break;
    case 'BUYER':
      currentMenu = BuyerMenuItems;
      break;
    default:
      currentMenu = SellerMenuItems;
  }

  return (
    <Box sx={{ px: "24px", overflowX: 'hidden', pt: 4 }}>
      <MUI_Sidebar width={"100%"} showProfile={false} themeColor={"#7B61FF"} themeSecondaryColor={'rgba(123, 97, 255, 0.1)'}>
        <Box sx={{ margin: "0 -24px", mb: 4, px: 3 }}>
          <Logo img={logoicn} component={NavLink} to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F8FAFC', letterSpacing: '1px' }}>
              UDRAKALA
            </Typography>
          </Logo>
        </Box>
        <Box sx={{ mt: 2 }}>
          {renderMenuItems(currentMenu, pathDirect)}
        </Box>
      </MUI_Sidebar>
    </Box>
  );
};

export default SidebarItems;
