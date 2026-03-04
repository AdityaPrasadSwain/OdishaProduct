import { createTheme } from "@mui/material/styles";
import typography from "./Typography";
import { shadows } from "./Shadows";

const baselightTheme = createTheme({
  direction: 'ltr',
  palette: {
    mode: 'dark',
    primary: {
      main: '#7B61FF',
      light: '#A391FF',
      dark: '#5B44CC',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00E5FF',
      light: '#6EFFFF',
      dark: '#00B2CC',
      contrastText: '#0B1120',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#ffffff',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#ffffff',
    },
    grey: {
      100: '#F8FAFC',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    background: {
      default: '#0B1120',
      paper: '#111827',
    },
    action: {
      disabledBackground: 'rgba(148, 163, 184, 0.12)',
      hoverOpacity: 0.08,
      hover: 'rgba(123, 97, 255, 0.08)',
    },
    divider: 'rgba(148, 163, 184, 0.1)',
  },
  typography,
  shadows,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0B1120',
          backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(123, 97, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(0, 229, 255, 0.1) 0%, transparent 50%)',
          backgroundAttachment: 'fixed',
          scrollbarWidth: 'thin',
          scrollbarColor: '#334155 #0B1120',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#0B1120',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#334155',
            borderRadius: '20px',
            border: '2px solid #0B1120',
          },
        },
        a: {
          textDecoration: "none",
          color: '#7B61FF',
          transition: 'color 0.2s ease-in-out',
          '&:hover': {
            color: '#00E5FF',
          },
        },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          boxShadow: 'none',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(123, 97, 255, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7B61FF 0%, #5B44CC 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          background: 'rgba(17, 25, 40, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 48px 0 rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(123, 97, 255, 0.3)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          transition: 'all 0.2s ease',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(148, 163, 184, 0.2)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(123, 97, 255, 0.5) !important',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#7B61FF !important',
            borderWidth: '2px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111827',
          '&.MuiMenu-paper': {
            background: 'rgba(17, 25, 40, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
          },
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
          background: 'rgba(17, 25, 40, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 40px 0 rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1E293B',
          color: '#F8FAFC',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 600,
          border: '1px solid rgba(123, 97, 255, 0.2)',
          padding: '6px 12px',
        },
        arrow: {
          color: '#1E293B',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '4px 8px',
          padding: '10px 12px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(123, 97, 255, 0.1)',
            color: '#7B61FF',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(123, 97, 255, 0.15)',
            color: '#7B61FF',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(123, 97, 255, 0.2)',
            },
          },
        },
      },
    },
  }
},

);

export { baselightTheme };
