import Profile from 'views/Profile'
import ControlPanel from 'views/ControlPanel/ControlPanel'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import PostPage from 'views/PostsPage'
import LogoutPage from './components/LogoutPage'
import ProfileAvatar from './components/Profile/ProfileAvatar'
import NotificationMobileView from './components/Notifications/NotificationMobileView'
import SearchPage from 'views/SearchPage'
import RequestAccessPage from 'views/RequestAccessPage/RequestAccessPage'

const routes = [
  {
    path: 'search',
    name: 'Search',
    rtlName: 'التقويم',
    icon: () => <img src="/assets/TrendingIcon.svg" alt="Trending" style={{width: '100%', height: '100%'}} />,
    component: SearchPage,
    layout: '/',
  },
  {
    path: 'post',
    name: 'Posts',
    icon: () => <img src="/assets/AddPost.svg" alt="Add Post" style={{width: '100%', height: '100%'}} />,
    component: PostPage,
    layout: '/',
  },
  {
    path: 'Notifications',
    name: 'Notifications',
    rtlName: 'التقويم',
    icon: () => <img src="/assets/NotificationsActive.svg" alt="Notifications" style={{width: '100%', height: '100%'}} />,
    component: NotificationMobileView,
    layout: '/',
    requiresAuth: true,
  },
  {
    path: 'Profile',
    name: 'My Profile',
    rtlName: 'الحاجيات',
    icon: ProfileAvatar,
    component: Profile,
    layout: '/',
  },
  {
    path: 'invite',
    name: 'Request Invite',
    component: RequestAccessPage,
    layout: '/',
  },
  {
    path: '/logout',
    name: 'Logout',
    rtlName: 'هعذاتسجيل الدخول',
    mini: 'L',
    rtlMini: 'هعذا',
    icon: ExitToAppIcon,
    component: LogoutPage,
    layout: '/logout',
  },
  {
    path: 'ControlPanel',
    name: 'Control Panel',
    component: ControlPanel,
    layout: '/',
    requiresAuth: true,
  },
]
export default routes
