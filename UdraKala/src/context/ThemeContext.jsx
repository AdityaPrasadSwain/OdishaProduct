
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
                        main: '#5747C7', // Orange-600
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
                                backgroundColor: mode === 'light' ? '#ffffff' : '#1B1A3A',
                                color: mode === 'light' ? '#111827' : '#ffffff',
                            }
                        }
                    },
                    MuiDataGrid: {
                        styleOverrides: {
                            root: {
                                border: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '16px',
                                backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(16px)',
                                overflow: 'hidden',
                                boxShadow: mode === 'light' ? '0 10px 15px -3px rgba(0, 0, 0, 0.05)' : '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                                '& .MuiDataGrid-cell': {
                                    borderBottom: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid rgba(255, 255, 255, 0.1)',
                                    color: mode === 'light' ? '#374151' : 'rgba(255, 255, 255, 0.9)',
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    borderBottom: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
                                    backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)',
                                    backdropFilter: 'blur(8px)',
                                    color: mode === 'light' ? '#6b7280' : 'rgba(255, 255, 255, 0.8)',
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.05em',
                                },
                                '& .MuiDataGrid-row:nth-of-type(even)': {
                                    backgroundColor: mode === 'light' ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                                },
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    transition: 'background-color 0.2s ease-out',
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    borderTop: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid rgba(255, 255, 255, 0.1)',
                                    backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                                    color: mode === 'light' ? '#6b7280' : 'rgba(255, 255, 255, 0.8)',
                                },
                                '& .MuiTablePagination-root': {
                                    color: mode === 'light' ? '#6b7280' : 'rgba(255, 255, 255, 0.8)',
                                }
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
