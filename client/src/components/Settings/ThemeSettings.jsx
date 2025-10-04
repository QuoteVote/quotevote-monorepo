import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Box,
  Chip,
  Divider,
  Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';
import { UPDATE_USER_THEME } from '../../graphql/mutations';
import { SET_USER_DATA } from '../../store/user';
import { useTheme } from '../../contexts/ThemeContext';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
  },
  card: {
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
  },
  colorPicker: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  themePreview: {
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    border: '1px solid #e0e0e0',
  },
  predefinedThemeCard: {
    cursor: 'pointer',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    border: '2px solid transparent',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  },
  selectedTheme: {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + '20',
  },
  customThemeSection: {
    marginTop: theme.spacing(3),
  },
  colorInput: {
    width: '100%',
  },
  actionButtons: {
    marginTop: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(1),
  },
}));

const ThemeSettings = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { currentTheme, isCustom, setTheme, updateCustomColors, resetToDefault, predefinedThemes } = useTheme();
  const [updateUserTheme, { loading }] = useMutation(UPDATE_USER_THEME);
  
  const [selectedThemeType, setSelectedThemeType] = useState(currentTheme.type || 'LIGHT');
  const [customColors, setCustomColors] = useState({
    primary: currentTheme.customColors?.primary || '#52b274',
    secondary: currentTheme.customColors?.secondary || '#E91E63',
    background: currentTheme.customColors?.background || '#EEF4F9',
    text: currentTheme.customColors?.text || '#000000',
  });

  useEffect(() => {
    if (currentTheme.type === 'CUSTOM' && currentTheme.customColors) {
      setCustomColors(currentTheme.customColors);
    }
    setSelectedThemeType(currentTheme.type || 'LIGHT');
  }, [currentTheme]);

  const handlePredefinedThemeSelect = async (themeType) => {
    setSelectedThemeType(themeType);
    const theme = predefinedThemes[themeType];
    setTheme(theme);
    
    try {
      await updateUserTheme({
        variables: {
          theme: {
            type: themeType,
          },
        },
      });
      
      // Update user data in Redux store
      dispatch(SET_USER_DATA({
        ...JSON.parse(localStorage.getItem('userData') || '{}'),
        theme: { type: themeType },
      }));
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const handleCustomColorChange = (colorType, value) => {
    const newColors = { ...customColors, [colorType]: value };
    setCustomColors(newColors);
    updateCustomColors(newColors);
  };

  const handleSaveCustomTheme = async () => {
    try {
      await updateUserTheme({
        variables: {
          theme: {
            type: 'CUSTOM',
            customColors,
          },
        },
      });
      
      // Update user data in Redux store
      dispatch(SET_USER_DATA({
        ...JSON.parse(localStorage.getItem('userData') || '{}'),
        theme: {
          type: 'CUSTOM',
          customColors,
        },
      }));
      
      setSelectedThemeType('CUSTOM');
    } catch (error) {
      console.error('Failed to save custom theme:', error);
    }
  };

  const handleResetToDefault = async () => {
    try {
      await updateUserTheme({
        variables: {
          theme: {
            type: 'LIGHT',
          },
        },
      });
      
      // Update user data in Redux store
      dispatch(SET_USER_DATA({
        ...JSON.parse(localStorage.getItem('userData') || '{}'),
        theme: { type: 'LIGHT' },
      }));
      
      resetToDefault();
      setSelectedThemeType('LIGHT');
    } catch (error) {
      console.error('Failed to reset theme:', error);
    }
  };

  const renderThemePreview = (theme) => {
    const colors = theme.customColors || theme.colors;
    return (
      <Box
        className={classes.themePreview}
        style={{
          backgroundColor: colors.background,
          color: colors.text,
        }}
      >
        <Typography variant="h6" style={{ color: colors.primary }}>
          Theme Preview
        </Typography>
        <Typography variant="body2" style={{ color: colors.text }}>
          This is how your theme will look
        </Typography>
        <Box
          style={{
            backgroundColor: colors.primary,
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            display: 'inline-block',
            marginTop: '8px',
          }}
        >
          Primary Button
        </Box>
      </Box>
    );
  };

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.sectionTitle}>
            Choose Your Theme
          </Typography>
          
          {/* Predefined Themes */}
          <Grid container spacing={2}>
            {Object.values(predefinedThemes).map((theme) => (
              <Grid item xs={12} sm={6} md={4} key={theme.type}>
                <Paper
                  className={`${classes.predefinedThemeCard} ${
                    selectedThemeType === theme.type ? classes.selectedTheme : ''
                  }`}
                  onClick={() => handlePredefinedThemeSelect(theme.type)}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    {theme.name}
                  </Typography>
                  {renderThemePreview(theme)}
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Divider style={{ margin: '24px 0' }} />

          {/* Custom Theme Builder */}
          <div className={classes.customThemeSection}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Custom Theme Builder
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Primary Color"
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                  className={classes.colorInput}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Secondary Color"
                  type="color"
                  value={customColors.secondary}
                  onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                  className={classes.colorInput}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Background Color"
                  type="color"
                  value={customColors.background}
                  onChange={(e) => handleCustomColorChange('background', e.target.value)}
                  className={classes.colorInput}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Text Color"
                  type="color"
                  value={customColors.text}
                  onChange={(e) => handleCustomColorChange('text', e.target.value)}
                  className={classes.colorInput}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            {/* Custom Theme Preview */}
            {renderThemePreview({ customColors })}

            <div className={classes.actionButtons}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveCustomTheme}
                disabled={loading}
              >
                Save Custom Theme
              </Button>
              <Button
                variant="outlined"
                onClick={handleResetToDefault}
                disabled={loading}
              >
                Reset to Default
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSettings;
