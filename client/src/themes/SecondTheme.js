import { createTheme } from '@mui/material/styles';

const SecondTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#52b274',
      contrastText: '#fff',
    },
    secondary: {
      main: '#E91E63',
    },
    text: {
      primary: '#424556',
    },
    accent: {
      main: '#56b3ff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    h1: {
      fontWeight: 600,
      color: '#424556',
    },
    h2: {
      fontWeight: 600,
      color: '#424556',
    },
    h3: {
      fontWeight: 600,
      color: '#424556',
    },
    h4: {
      fontWeight: 600,
      color: '#424556',
    },
    h5: {
      fontWeight: 600,
      color: '#424556',
    },
    h6: {
      fontWeight: 600,
      color: '#424556',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 20px',
          fontSize: '0.875rem',
          fontWeight: 500,
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(82, 178, 116, 0.3)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #52b274 30%, #66c588 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #449a61 30%, #52b274 90%)',
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#d81b60',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&.Mui-focused fieldset': {
              borderColor: '#52b274',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
        elevation1: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
        elevation2: {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#424556',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: 'rgba(82, 178, 116, 0.1)',
          color: '#52b274',
          '&:hover': {
            backgroundColor: 'rgba(82, 178, 116, 0.2)',
          },
        },
      },
    },
  },
});

export default SecondTheme;
