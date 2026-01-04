
import React, { createContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

export const ThemeContext = createContext();

export const useTheme = () => React.useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (mode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', mode);
    }, [mode]);

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: '#ea580c', // Orange-600
                    },
                    secondary: {
                        main: '#4f46e5', // Indigo-600
                    },
                    background: {
                        default: mode === 'light' ? '#f9fafb' : '#111827',
                        paper: mode === 'light' ? '#ffffff' : '#1f2937',
                    },
                },
                components: {
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor: mode === 'light' ? '#ffffff' : '#1f2937',
                                color: mode === 'light' ? '#111827' : '#ffffff',
                            }
                        }
                    }
                }
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={{ mode, toggleColorMode, theme: mode, toggleTheme: toggleColorMode }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
