# Quote Vote - Frontend Component Library

This document provides a comprehensive reference for Quote Vote's React component library, built with Material-UI and organized for maximum reusability and developer productivity.

## 📋 Table of Contents

- [Overview](#overview)
- [Component Principles](#component-principles)
- [Architecture & Organization](#architecture--organization)
- [Layout Components](#layout-components)
- [Core UI Components](#core-ui-components)
- [Material-UI Pro Components](#material-ui-pro-components)
- [Feature Components](#feature-components)
- [Styling Guidelines](#styling-guidelines)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Component Composition Patterns](#component-composition-patterns)
- [Testing Components](#testing-components)
- [Troubleshooting](#troubleshooting)

---

## Overview

Quote Vote's frontend is built as a React Single Page Application (SPA) using:

- **Framework**: React
- **Language**: JavaScript (with planned TypeScript migration)
- **UI Library**: Material-UI (MUI) with Material Dashboard Pro
- **State Management**: Redux Toolkit + Apollo Client Cache
- **Build Tool**: Vite
- **Testing**: Vitest + Cypress
- **Documentation**: Storybook

### Component Directory Structure

```
client/src/
├── components/           # Custom reusable UI components
├── layouts/             # Layout components (Auth, Admin, RTL)
├── mui-pro/             # Material-UI Pro dashboard components
├── ui/                  # Basic UI primitives
└── views/               # Page-level components
```

---

## Component Principles

### 🔄 Reusability
Components should be designed for reuse across different features and contexts.

### 🧩 Composability
Build complex UI structures by composing simpler, focused components.

### ♿ Accessibility
All components must be accessible via keyboard navigation and screen readers (WCAG 2.1 AA).

### 📱 Responsiveness
Components adapt gracefully to different screen sizes using Material-UI's responsive system.

### 🎨 Consistent Styling
Follow Material-UI theming and design system for visual consistency.

---

## Architecture & Organization

### Component Hierarchy

```
Layout Components (layouts/)
├── Material-UI Pro Components (mui-pro/)
├── Custom UI Components (components/)
├── Basic UI Primitives (ui/)
└── Page Components (views/)
```

### File Naming Conventions

- **Components**: PascalCase with `.jsx` extension (e.g., `UserProfile.jsx`)
- **Directories**: camelCase or kebab-case
- **Assets**: Various naming conventions depending on type

---

## Layout Components

Located in `client/src/layouts/`

### Admin.jsx

**Purpose**: Main dashboard layout for authenticated users with sidebar navigation

**Use Case**: Primary layout for all authenticated user pages

**Key Features**:
- Collapsible sidebar navigation
- AdminNavbar header
- Perfect scrollbar integration
- Fixed plugin for theme customization
- Route-based content rendering

**Props/API**:
```javascript
// Uses React Router props and location state
// No direct props - configured via routes
```

**Common Patterns**:
```jsx
// Layout wraps all admin routes
<Switch>
  <Route path="/admin" render={(props) => <Admin {...props} />} />
</Switch>
```

---

### Auth.jsx

**Purpose**: Layout wrapper for authentication pages

**Use Case**: Login, signup, password reset, and other auth flows

**Key Features**:
- Random background image selection
- AuthNavbar for minimal navigation
- Centered content layout
- Footer integration

**Props/API**:
```javascript
// Uses React Router props
// Background images rotated randomly from predefined set
```

**Usage Example**:
```jsx
// Used automatically for auth routes
<Route path="/auth" render={(props) => <Auth {...props} />} />
```

---

### RTL.jsx

**Purpose**: Right-to-left layout support for international users

**Use Case**: Arabic, Hebrew, and other RTL language support

**Key Features**:
- RTL-specific styling
- Mirrored sidebar and navigation
- RTL-compatible scrolling

---

### Scoreboard.jsx

**Purpose**: A high-level layout wrapper for the main application views.

**Use Case**: Wraps the main content, sidebar, and navigation for authenticated users.

**Props/API**:

```javascript
// This component is a layout wrapper and does not accept any specific props.
// It receives props from React Router and the withUser HOC.
```

---

## Core UI Components

Located in `client/src/components/`

### Alert.jsx

**Purpose**: Display a notification-style alert with creator information.

**Use Case**: Showing alerts that are associated with a specific user action or event.

**Props/API**:

*Note: This interface is illustrative; the codebase is currently JavaScript.*
```ts
interface AlertProps {
  AlertTitle: string;
  AlertBody: string;
  creator: {
    name: string;
    profileImageUrl: string;
  };
  time: string;
  color?: string; // Background color
}
```

**Usage Example**:

```jsx
<Alert
  AlertTitle="New Post"
  AlertBody="Check out the latest post from your network!"
  creator={{ name: 'Jane Doe', profileImageUrl: '...' }}
  time="5 minutes ago"
  color="#4CAF50"
/>
```

---

### Avatar.jsx

**Purpose**: Display a configurable cartoon-style avatar using the `avataaars` library.

**Use Case**: User profiles and other areas where a visual representation of a user is needed.

**Props/API**:

*Note: This interface is illustrative; the codebase is currently JavaScript.*
```ts
interface AvatarProps {
  topType: string;
  accessoriesType: string;
  hairColor: string;
  facialHairType: string;
  facialHairColor: string;
  clotheType: string;
  clotheColor: string;
  eyeType: string;
  eyebrowType: string;
  mouthType: string;
  skinColor: string;
  hatColor: string;
  height?: number | string;
}
```

**Usage Example**:

```jsx
<Avatar
  topType="LongHairMiaWallace"
  accessoriesType="Prescription02"
  hairColor="BrownDark"
  facialHairType="Blank"
  clotheType="Hoodie"
  clotheColor="PastelBlue"
  eyeType="Happy"
  eyebrowType="Default"
  mouthType="Smile"
  skinColor="Light"
  height="100px"
/>
```

---

### LoadingSpinner.jsx

**Purpose**: Indicate loading states throughout the application

**Use Case**: Data fetching, form submissions, page transitions

**Implementation**: Custom spinner component with Material-UI styling

---

### ContentList.jsx

**Purpose**: Generic list component for displaying various content types

**Use Case**: Post feeds, user lists, search results

**Features**:
- Pagination support
- Loading states
- Empty state handling
- Customizable item rendering

---

### DateSearchBar.jsx

**Purpose**: A date range picker for filtering content, built as a wrapper around `react-dates`.

**Use Case**: Filtering lists of posts or activities by a date range.

**Props/API**:

*Note: This interface is illustrative; the codebase is currently JavaScript.*
```ts
interface DatepickerProps {
  setOffset: (offset: number) => void;
  setDateRangeFilter: (range: { startDate: Date, endDate: Date }) => void;
  dateRangeFilter: {
    startDate: Date;
    endDate: Date;
  };
}
```

---

### CompleteSearch.jsx

**Purpose**: Autocomplete search functionality

**Use Case**: User search, content search, navigation

**Features**:
- Real-time suggestions
- Keyboard navigation
- Custom result rendering

---

### CustomExpansionPanel.jsx

**Purpose**: Collapsible content sections

**Use Case**: FAQ sections, detailed content, settings panels

**Features**:
- Smooth expand/collapse animations
- Customizable headers
- Nested panel support

---

### ErrorBoundary.jsx

**Purpose**: Catch and handle React component errors gracefully

**Use Case**: Error handling throughout the application

**Features**:
- Error logging
- Fallback UI display
- Development vs production error handling

---

### AlertList.jsx & AlertSkeletonLoader.jsx

**Purpose**: List container for alerts with skeleton loading states

**Use Case**: Activity feeds, notification lists

**Features**:
- Skeleton loading animation
- Infinite scroll support
- Real-time updates

---

### ActivityBar.jsx

**Purpose**: Activity indicator and navigation bar

**Use Case**: Show user activity status and quick navigation

---

### TokenExpired.jsx

**Purpose**: Displays a modal to the user when their authentication token has expired.

**Use Case**: Forcing a user to re-authenticate after a session timeout.

**Props/API**:

```javascript
// This component does not accept any props.
```

---

## UI Primitives (`client/src/ui`)

This directory contains basic, foundational UI components.

#### ActivityCard (`ActivityCard/index.jsx`)

**Purpose**: A card component for displaying a single activity item.

**Props/API**:

*Note: This interface is illustrative; the codebase is currently JavaScript.*
```ts
import * as React from 'react';
interface ActivityCardProps {
  avatar?: React.ReactNode | string;
  cardColor?: string;
  name?: string;
  date?: string;
  content?: string;
  comments?: any[];
  quotes?: any[];
  messages?: any[];
  votes?: any[];
  liked?: boolean;
  width?: 'lg' | 'md' | 'sm' | 'xl' | 'xs';
  onLike?: () => void;
  onCardClick?: () => void;
  handleRedirectToProfile?: () => void;
  username?: string;
  post?: Record<string, unknown>;
  activityType?: string;
}
```

---

#### Dialog (`Dialog/index.jsx`)

**Purpose**: A generic dialog or modal component.

**Props/API**:

*Note: This interface is illustrative; the codebase is currently JavaScript.*
```ts
interface DialogProps {
  title?: string;
  body?: string;
  confirmText?: string;
  width?: number;
  onCancel?: () => void;
  onConfirm?: () => void;
}
```

---

## Material-UI Pro Components

Located in `client/src/mui-pro/`

### Navigation Components

#### AdminNavbar.jsx
**Purpose**: Top navigation bar for admin dashboard
**Features**:
- User menu dropdown
- Notifications
- Search functionality
- Responsive hamburger menu

#### AdminNavbarLinks.jsx
**Purpose**: Navigation links and user actions for admin navbar
**Features**:
- User profile dropdown
- Notification badge
- Search input
- Dashboard navigation

#### AuthNavbar.jsx
**Purpose**: Minimal navigation for authentication pages
**Features**:
- Logo/branding
- Basic navigation links
- Responsive design

#### Sidebar.jsx
**Purpose**: Collapsible sidebar navigation
**Features**:
- Hierarchical navigation
- Active state indicators
- Mini/full view modes
- Custom logo placement

---

### Card Components

#### Card.jsx, CardHeader.jsx, CardBody.jsx, CardFooter.jsx, CardIcon.jsx, CardAvatar.jsx
**Purpose**: Flexible card layout system
**Features**:
- Multiple color schemes
- Icon and avatar support
- Consistent spacing
- Shadow variations

**Usage Example**:
```jsx
import Card from 'mui-pro/Card/Card';
import CardHeader from 'mui-pro/Card/CardHeader';
import CardBody from 'mui-pro/Card/CardBody';

<Card>
  <CardHeader color="primary">
    <h4>Card Title</h4>
  </CardHeader>
  <CardBody>
    <p>Card content</p>
  </CardBody>
</Card>
```

---

### Form Components

#### CustomInput.jsx
**Purpose**: Enhanced input field with Material-UI styling
**Features**:
- Label animations
- Error state handling
- Multiple variants (outlined, filled, standard)
- Icon support

#### CustomDropdown.jsx
**Purpose**: Dropdown menu component
**Features**:
- Custom styling
- Multi-select support
- Search functionality
- Keyboard navigation

---

### Data Display Components

#### Table.jsx
**Purpose**: Enhanced table component for data display
**Features**:
- Sorting
- Pagination
- Row selection
- Custom cell rendering

#### Timeline.jsx
**Purpose**: Timeline component for chronological data
**Features**:
- Customizable icons
- Color coding
- Responsive layout
- Animation effects

---

### Feedback Components

#### Snackbar.jsx & SnackbarContent.jsx
**Purpose**: Toast notifications and alerts
**Features**:
- Auto-dismiss
- Action buttons
- Multiple severity levels
- Position control

---

### Navigation & Layout

#### Pagination.jsx
**Purpose**: Page navigation component
**Features**:
- Previous/next navigation
- Page number display
- Customizable appearance
- Responsive behavior

#### GridContainer.jsx & GridItem.jsx
**Purpose**: Responsive grid layout system
**Features**:
- 12-column grid
- Responsive breakpoints
- Flexible spacing
- Alignment options

---

### Specialized Components

#### CustomButtons/Button.jsx
**Purpose**: Enhanced button component with multiple variants
**Features**:
- Multiple sizes and colors
- Icon support
- Loading states
- Disabled states

#### Badge.jsx
**Purpose**: Badge component for status indicators
**Features**:
- Multiple colors
- Custom positioning
- Number badges
- Dot indicators

#### CustomTabs.jsx
**Purpose**: Tab navigation component
**Features**:
- Multiple orientations
- Custom icons
- Animated transitions
- Responsive behavior

---

## Feature Components

### Icons (client/src/components/Icons/)

Custom icon components for Quote Vote specific actions:

- **Calendar.jsx** - Calendar/date related icons
- **CheckBoxFilled.jsx** - Checkbox states
- **Up.jsx & Down.jsx** - Voting arrows
- **Search.jsx** - Search functionality
- **Filter.jsx** - Content filtering
- **Group.jsx** - Group/community icons
- **Comment.jsx** - Comment indicators
- **Quote.jsx** - Quote highlighting

**Usage Example**:
```jsx
import { Up, Down, Comment } from 'components/Icons';

<Up className={classes.upvoteIcon} />
<Down className={classes.downvoteIcon} />
<Comment className={classes.commentIcon} />
```

---

## Views and Page Components

Located in `client/src/views/` and `client/src/mui-pro/views/`

### Dashboard Components
- **Dashboard.jsx** - Main dashboard view
- **Charts.jsx** - Data visualization
- **Calendar.jsx** - Calendar interface

### Form Components
- **RegularForms.jsx** - Standard form layouts
- **ExtendedForms.jsx** - Complex form components
- **ValidationForms.jsx** - Form validation examples
- **Wizard.jsx** - Multi-step form workflows

### Component Examples
- **Buttons.jsx** - Button showcase and examples
- **Typography.jsx** - Text styling examples
- **Icons.jsx** - Icon library showcase
- **Notifications.jsx** - Notification examples
- **Panels.jsx** - Panel component examples
- **SweetAlert.jsx** - Alert dialog examples

---

## Styling Guidelines

### Material-UI Theming

Components use Material-UI's `makeStyles` hook:

```javascript
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
}));
```

### Style Organization

- **Component styles**: Co-located with components using `makeStyles`
- **Global styles**: Located in `client/src/assets/jss/`
- **SCSS files**: Located in `client/src/assets/scss/`
- **Theme configuration**: `client/src/theme.js`

### Responsive Design Patterns

```javascript
// Example from SettingsContent.jsx
const useStyles = makeStyles((theme) => ({
  panelContainer: {
    [theme.breakpoints.up('lg')]: {
      padding: 20,
      paddingTop: 30,
    },
    [theme.breakpoints.down('md')]: {
      padding: 10,
    },
    [theme.breakpoints.down('xs')]: {
      padding: 0,
    },
  },
}));
```

---

## Accessibility Guidelines

### Implemented Patterns

1. **Semantic HTML**: Components use appropriate HTML elements
2. **ARIA Labels**: Interactive elements include proper ARIA attributes
3. **Keyboard Navigation**: All interactive components support keyboard usage
4. **Focus Management**: Proper focus indicators and management
5. **Screen Reader Support**: Alt text and descriptive labels

### Example Implementation

```jsx
// From actual codebase patterns
<button
  aria-label="Close notification"
  onClick={handleClose}
  className={classes.closeButton}
>
  <CloseIcon />
</button>
```

---

## Component Composition Patterns

### Material-UI Pro Pattern

```jsx
// Consistent pattern used throughout mui-pro components
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const styles = {
  root: {
    padding: '1rem',
  },
};
const useStyles = makeStyles(styles);

export default function Component(props) {
  const classes = useStyles();
  const { className, children, ...other } = props;
  
  return (
    <div className={classNames(classes.root, className)} {...other}>
      {children}
    </div>
  );
}

Component.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
```

### Layout Wrapper Pattern

```jsx
// Pattern used in Admin.jsx and Auth.jsx
<div className={classes.wrapper}>
  <Sidebar />
  <div className={classes.mainPanel}>
    <AdminNavbar />
    <div className={classes.content}>
      <Switch>
        {/* Routes */}
      </Switch>
    </div>
    <Footer />
  </div>
</div>
```

---

## Testing Components

### Storybook Integration

Components are documented using Storybook:

```bash
npm run storybook --workspace=client
```

### Test Files

- **Unit Tests**: Using Vitest framework
- **E2E Tests**: Cypress integration tests in `client/cypress/`
- **Test Configuration**: `vitest.config.js` and `cypress.json`

### Example Test Structure

```javascript
// Following the established pattern
import { render, screen } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  test('renders correctly', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

---

## Troubleshooting

### Common Issues

#### 1. Import Path Errors

**Problem**: Module not found errors for mui-pro components

**Solution**: Use correct import paths from jsconfig.json aliases:
```javascript
// Correct
import Button from 'mui-pro/CustomButtons/Button';
import Card from 'mui-pro/Card/Card';

// Incorrect
import Button from '../mui-pro/CustomButtons/Button';
```

#### 2. Theme Not Applied

**Problem**: Material-UI theme not working

**Solution**: Ensure ThemeProvider wraps your app:
```jsx
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

#### 3. Responsive Breakpoints

**Problem**: Components not responsive

**Solution**: Use Material-UI breakpoint system:
```javascript
const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
}));
```

#### 4. PerfectScrollbar Issues

**Problem**: Scrollbar not working in Admin layout

**Solution**: Ensure PerfectScrollbar is properly initialized:
```javascript
// From Admin.jsx pattern
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
```

### Getting Help

- Check existing component implementations in the codebase
- Review Material-UI documentation for theming issues
- Consult the Storybook documentation: `docs/storybook-guide.md`
- Ask questions in GitHub issues

---

## Contributing to Components

### Component Development Workflow

1. **Create component** in appropriate directory (`components/`, `mui-pro/`, or `ui/`)
2. **Follow naming conventions**: PascalCase with `.jsx` extension
3. **Use Material-UI patterns**: `makeStyles`, proper prop types, class composition
4. **Add Storybook story** if applicable
5. **Include responsive design** using theme breakpoints
6. **Add proper PropTypes** validation
7. **Update this documentation**

### Component Template

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles((theme) => ({
  root: {
    // Component styles using theme
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
}));

export default function NewComponent(props) {
  const classes = useStyles();
  const { className, children, ...other } = props;
  
  return (
    <div className={classNames(classes.root, className)} {...other}>
      {children}
    </div>
  );
}

NewComponent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
```

### Code Quality Checklist

- [ ] Follows existing patterns in the codebase
- [ ] Uses `.jsx` file extension
- [ ] Includes PropTypes validation
- [ ] Uses Material-UI theming system
- [ ] Implements responsive design
- [ ] Follows accessibility guidelines
- [ ] Has proper error handling
- [ ] Includes JSDoc comments if needed

---

## File Structure Reference

### Complete Component Directory Structure

```
client/src/
├── components/
│   ├── ActivityBar.jsx
│   ├── Alert.jsx
│   ├── AlertList.jsx
│   ├── AlertSkeletonLoader.jsx
│   ├── CompleteSearch.jsx
│   ├── ContentList.jsx
│   ├── CustomExpansionPanel.jsx
│   ├── DateSearchBar.jsx
│   ├── Avatar.jsx
│   ├── ErrorBoundary.jsx
│   ├── LoadingSpinner.jsx
│   ├── TokenExpired.jsx
│   ├── Icons/
│   │   ├── index.jsx
│   │   ├── Calendar.jsx
│   │   ├── CheckBoxFilled.jsx
│   │   ├── Comment.jsx
│   │   ├── Down.jsx
│   │   ├── Filter.jsx
│   │   ├── Group.jsx
│   │   ├── Quote.jsx
│   │   ├── Search.jsx
│   │   └── Up.jsx
│   └── [other feature components...]
├── layouts/
│   ├── Admin.jsx
│   ├── Auth.jsx
│   ├── RTL.jsx
│   └── Scoreboard.jsx
├── mui-pro/
│   ├── Badge/
│   ├── Card/
│   ├── CustomButtons/
│   ├── CustomDropdown/
│   ├── CustomInput/
│   ├── CustomTabs/
│   ├── Footer/
│   ├── Grid/
│   ├── Navbars/
│   ├── Pagination/
│   ├── Sidebar/
│   ├── Snackbar/
│   ├── Table/
│   ├── Timeline/
│   └── views/
├── ui/
│   ├── ActivityCard/
│   └── Dialog/
└── views/
    └── [page-level components]
```

---

**Note**: This documentation accurately reflects the current Quote Vote component library structure and implementation. All component names, file extensions, and usage patterns match the actual codebase as of the latest update.