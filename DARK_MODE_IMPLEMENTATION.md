# Dark Mode Implementation Guide

## Overview
This implementation adds a comprehensive dark mode toggle feature to the QuoteVote application, addressing GitHub issue #107. The solution provides seamless theme switching with persistence across sessions.

## Features Implemented

### ✅ Core Requirements Met
- **Dark Mode Toggle**: Available in Settings screen with intuitive switch UI
- **Immediate Switching**: Theme updates instantly without page reload
- **Persistence**: Theme preference saved in localStorage (guests) and user profile (logged-in users)
- **Complete Styling**: All components support both light and dark modes
- **Accessibility**: Proper contrast ratios and color adjustments for both themes

### 🎨 Design Features
- **Brand Consistency**: Maintains QuoteVote's green primary color (#52b274) across themes
- **Smart Color Adaptation**: Activity cards, alerts, and UI elements adapt intelligently
- **User Experience**: Clear visual feedback and descriptive toggle labels
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Technical Implementation

### 1. Theme Context System (`/client/src/Context/ThemeContext.jsx`)
```javascript
// Provides theme state management and MUI theme integration
- createAppTheme(mode): Creates comprehensive theme objects
- useTheme(): Hook for accessing theme state and toggle function
- ThemeProvider: Wraps app with theme context and MUI ThemeProvider
```

### 2. Dark Mode Toggle Component (`/client/src/components/Settings/DarkModeToggle.jsx`)
```javascript
// User-friendly toggle in Settings screen
- Visual icons (sun/moon) for current theme state
- Descriptive text explaining the current mode
- Smooth Material-UI Switch component
- Responsive design for mobile and desktop
```

### 3. Backend Schema Updates
```javascript
// GraphQL Schema Extensions
- UserInput: Added themePreference field
- User Type: Added themePreference field  
- MongoDB Model: Added themePreference with enum validation ['light', 'dark']
```

### 4. Theme Persistence Strategy
```javascript
// Dual persistence approach
- Guest Users: localStorage.setItem('themeMode', mode)
- Logged-in Users: GraphQL mutation to update user profile
- Automatic sync between localStorage and user profile
```

## Color Palette Specifications

### Light Mode
- **Background**: #EEF4F9 (light blue-gray)
- **Paper**: #ffffff (white)
- **Text Primary**: #000000 (black)
- **Text Secondary**: #424556 (dark gray)

### Dark Mode  
- **Background**: #121212 (Material Design dark)
- **Paper**: #1e1e1e (elevated dark)
- **Text Primary**: #ffffff (white)
- **Text Secondary**: #b0b0b0 (light gray)

### Activity Card Colors (Adaptive)
| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Upvote | #52b274 | #52b274 |
| Downvote | #FF6060 | #ef5350 |
| Quoted | #E36DFA | #ba68c8 |
| Hearted | #F16C99 | #f06292 |

## Usage Instructions

### For Users
1. **Access Settings**: Click the Settings icon in the navigation
2. **Find Dark Mode**: Locate the "Dark Mode" toggle in the Settings panel
3. **Toggle Theme**: Click the switch to change between light and dark modes
4. **Automatic Save**: Theme preference is automatically saved

### For Developers
```javascript
// Using the theme context in components
import { useTheme } from '../Context/ThemeContext'

function MyComponent() {
  const { themeMode, toggleTheme, isDarkMode } = useTheme()
  
  return (
    <div>
      <p>Current theme: {themeMode}</p>
      <button onClick={toggleTheme}>
        Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  )
}
```

```javascript
// Accessing theme colors in makeStyles
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    // Access custom colors
    borderColor: theme.custom?.activityCards?.upvote?.color,
  }
}))
```

## Testing Checklist

### ✅ Functionality Tests
- [x] Toggle switches between light and dark modes
- [x] Theme persists after page refresh
- [x] Guest users: theme saved in localStorage
- [x] Logged-in users: theme saved in user profile
- [x] Settings UI updates immediately
- [x] All major components render correctly in both modes

### ✅ Visual Tests
- [x] Proper contrast ratios maintained
- [x] Activity cards display correct colors
- [x] Navigation and headers adapt properly
- [x] Form elements (inputs, buttons) styled correctly
- [x] Modal dialogs and overlays work in both modes

### ✅ Responsive Tests
- [x] Mobile devices display toggle correctly
- [x] Tablet layouts maintain functionality
- [x] Desktop experience is optimal

## File Structure
```
client/src/
├── Context/
│   └── ThemeContext.jsx          # Main theme management
├── components/
│   ├── Settings/
│   │   ├── DarkModeToggle.jsx    # Toggle component
│   │   └── SettingsContent.jsx    # Updated settings (includes toggle)
│   └── ThemeTest.jsx             # Test component for verification
├── main.jsx                      # Updated to use new ThemeProvider
└── graphql/
    └── mutations.jsx             # Updated UPDATE_USER mutation

server/app/data/
├── types/
│   └── User.js                   # Added themePreference field
├── inputs/
│   └── UserInput.js              # Added themePreference field
└── resolvers/models/
    └── UserModel.js              # Added MongoDB schema field
```

## Migration Notes

### Backward Compatibility
- Existing theme imports continue to work
- Components using old theme system remain functional
- Gradual migration path available for updating components

### Database Migration
- New `themePreference` field added to User model
- Default value: 'light'
- Enum validation: ['light', 'dark']
- Existing users will default to light mode

## Performance Considerations
- Theme switching is instantaneous (no API calls for guests)
- Logged-in users: Single GraphQL mutation for persistence
- Theme context prevents unnecessary re-renders
- Custom theme properties cached in theme object

## Accessibility Features
- High contrast ratios maintained in both modes
- Clear visual indicators for current theme state
- Keyboard navigation support for toggle
- Screen reader friendly labels and descriptions
- Follows Material Design accessibility guidelines

## Future Enhancements
- [ ] System theme detection (prefers-color-scheme)
- [ ] Custom theme colors for premium users
- [ ] Automatic theme switching based on time of day
- [ ] Theme preview before applying
- [ ] Additional theme variants (high contrast, etc.)

## Troubleshooting

### Common Issues
1. **Theme not persisting**: Check localStorage and user profile sync
2. **Colors not updating**: Verify component uses theme context
3. **Toggle not visible**: Check Settings component integration

### Debug Tools
- Use `ThemeTest.jsx` component to verify theme switching
- Check browser localStorage for 'themeMode' key
- Verify GraphQL mutations in Network tab
- Use React DevTools to inspect theme context

## Support
For issues or questions about the dark mode implementation:
1. Check this documentation first
2. Review the test component (`ThemeTest.jsx`)
3. Examine the theme context implementation
4. Create an issue with detailed reproduction steps
