// Root-level shim for `@mui/icons-material` named exports used in tests.
// Export commonly-used icon names as a lightweight React stub so import-analysis
// doesn't open the real icon files.
import React from 'react'

const Stub = (props) => React.createElement('span', { 'data-testid': props['data-testid'] || 'mui-icon', className: props.className }, null)

// List of icon names used across the codebase (common ones). Add more if tests
// complain about missing named exports.
const names = [
  'CardTravel','Extension','Fingerprint','FlightLand','Build','ExitToApp','Image','Face','Email','Home','BugReport','Code','Cloud','FormatQuote','Business','AccountBalance','Store','Warning','DateRange','LocalOffer','Update','ArrowUpward','AccessTime','Refresh','Edit','Place','ArtTrack','Language','Assignment','Dvr','Favorite','Close','Check','Timeline','PermIdentity','KeyboardArrowLeft','KeyboardArrowRight','PriorityHigh','FavoriteBorder','Menu','Add','Edit','Close','Bookmark','BookmarkBorder','Assignment','ArrowUpward','ArrowDownward','Chat','ArrowBack','LockOutlined','Visibility','VisibilityOff','SentimentDissatisfiedOutlined','Error','ExpandMore','Face','Lock','InsertEmoticon','InsertLink','Delete','DeleteOutline','Send','Search','KeyboardBackspace','MailOutline','Mail','Person','Notifications','Dashboard','Search','PhotoCamera','PersonAdd','PersonAddDisabled','PersonAdd','PersonAddDisabled'
]

// Named exports
const exportsObj = {}
names.forEach((n) => {
  // Normalize some names used with suffixes in code
  const key = n.replace(/Icon$/, '')
  exportsObj[n] = Stub
})

// ESM named exports — default + named exports for static imports
export default Stub
// Explicitly export each to satisfy static analysis
// (we can't programmatically export names in ESM; write them out)
export const CardTravel = Stub
export const Extension = Stub
export const Fingerprint = Stub
export const FlightLand = Stub
export const Build = Stub
export const ExitToApp = Stub
export const Image = Stub
export const Face = Stub
export const Email = Stub
export const Home = Stub
export const BugReport = Stub
export const Code = Stub
export const Cloud = Stub
export const FormatQuote = Stub
export const Business = Stub
export const AccountBalance = Stub
export const Store = Stub
export const Warning = Stub
export const DateRange = Stub
export const LocalOffer = Stub
export const Update = Stub
export const ArrowUpward = Stub
export const AccessTime = Stub
export const Refresh = Stub
export const Edit = Stub
export const Place = Stub
export const ArtTrack = Stub
export const Language = Stub
export const Assignment = Stub
export const Dvr = Stub
export const Favorite = Stub
export const Close = Stub
export const Check = Stub
export const Timeline = Stub
export const PermIdentity = Stub
export const KeyboardArrowLeft = Stub
export const KeyboardArrowRight = Stub
export const PriorityHigh = Stub
export const FavoriteBorder = Stub
export const Menu = Stub
export const Add = Stub
export const Bookmark = Stub
export const BookmarkBorder = Stub
export const ArrowDownward = Stub
export const Chat = Stub
export const ArrowBack = Stub
export const LockOutlined = Stub
export const Visibility = Stub
export const VisibilityOff = Stub
export const SentimentDissatisfiedOutlined = Stub
export const ErrorIcon = Stub
export const ExpandMore = Stub
export const Lock = Stub
export const InsertEmoticon = Stub
export const InsertLink = Stub
export const Delete = Stub
export const DeleteOutline = Stub
export const Send = Stub
export const Search = Stub
export const KeyboardBackspace = Stub
export const MailOutline = Stub
export const Person = Stub
export const Notifications = Stub
export const Dashboard = Stub
export const PhotoCamera = Stub
export const PersonAdd = Stub
export const PersonAddDisabled = Stub
