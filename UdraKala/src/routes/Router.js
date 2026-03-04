import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

/* ***Layouts**** */
const FullLayout = lazy(() => import('../layouts/full/FullLayout'));
const BlankLayout = lazy(() => import('../layouts/blank/BlankLayout'));

/* ****Pages***** */
const Dashboard = lazy(() => import('../views/dashboard/Dashboard'))
const SamplePage = lazy(() => import('../views/sample-page/SamplePage'))
const Icons = lazy(() => import('../views/icons/Icons'))
const TypographyPage = lazy(() => import('../views/utilities/TypographyPage'))
const Shadow = lazy(() => import('../views/utilities/Shadow'))
const Error = lazy(() => import('../views/authentication/Error'));
const Register = lazy(() => import('../views/authentication/Register'));
const Login = lazy(() => import('../views/authentication/Login'));

const BasicTable = lazy(() => import("../views/tables/BasicTable"));
const ExAutoComplete = lazy(() =>
  import("../views/form-elements/ExAutoComplete")
);
const ExButton = lazy(() => import("../views/form-elements/ExButton"));
const ExCheckbox = lazy(() => import("../views/form-elements/ExCheckbox"));
const ExRadio = lazy(() => import("../views/form-elements/ExRadio"));
const ExSlider = lazy(() => import("../views/form-elements/ExSlider"));
const ExSwitch = lazy(() => import("../views/form-elements/ExSwitch"));
const FormLayouts = lazy(() => import("../views/form-layouts/FormLayouts"));
const ProductWizard = lazy(() => import("../views/seller/product/ProductWizard"));
const DraftList = lazy(() => import("../views/seller/product/DraftList"));
const Orders = lazy(() => import("../views/seller/orders/Orders"));
const Payments = lazy(() => import("../views/seller/payments/Payments"));
const Profile = lazy(() => import("../views/seller/profile/Profile"));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
      { path: '/icons', exact: true, element: <Icons /> },
      { path: '/ui/typography', exact: true, element: <TypographyPage /> },
      { path: '/ui/shadow', exact: true, element: <Shadow /> },
      { path: "/tables/basic-table", element: <BasicTable /> },
      { path: "/form-layouts", element: <FormLayouts /> },
      { path: "/form-elements/autocomplete", element: <ExAutoComplete /> },
      { path: "/form-elements/button", element: <ExButton /> },
      { path: "/form-elements/checkbox", element: <ExCheckbox /> },
      { path: "/form-elements/radio", element: <ExRadio /> },
      { path: "/form-elements/slider", element: <ExSlider /> },
      { path: "/form-elements/switch", element: <ExSwitch /> },

      // Seller Routes
      { path: "/seller/products/create", element: <ProductWizard /> },
      { path: "/seller/products/edit/:id", element: <ProductWizard /> },
      { path: "/seller/drafts", element: <DraftList /> },
      { path: "/seller/orders", element: <Orders /> },
      { path: "/seller/payments", element: <Payments /> },
      { path: "/seller/profile", element: <Profile /> },

      // Admin Placeholders
      { path: "/admin/dashboard", element: <SamplePage /> },
      { path: "/admin/sellers", element: <SamplePage /> },
      { path: "/admin/categories", element: <SamplePage /> },
      { path: "/admin/analytics", element: <SamplePage /> },
      { path: "/admin/settings", element: <SamplePage /> },

      // Buyer Placeholders
      { path: "/buyer/orders", element: <SamplePage /> },
      { path: "/buyer/history", element: <SamplePage /> },
      { path: "/buyer/wishlist", element: <SamplePage /> },
      { path: "/buyer/profile", element: <SamplePage /> },

      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);

export default router;
