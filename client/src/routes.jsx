import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import ControlPanel from 'views/ControlPanel/ControlPanel'
import HomePage from 'views/Homepage/Homepage'
import PostPage from 'views/PostsPage'
import Profile from 'views/Profile'
import SearchPage from 'views/SearchPage'
import HomeSvg from './assets/svg/Home'
import LogoutPage from './components/LogoutPage'
import NotificationMobileView from './components/Notifications/NotificationMobileView'
import ProfileAvatar from './components/Profile/ProfileAvatar'

const routes = [
  {
    path: 'home',
    name: 'Home Page',
    rtlName: 'لوحة القيادة',
    icon: HomeSvg,
    component: HomePage,
    layout: '/',
  },
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
    path: 'notifications',
    name: 'Notifications',
    rtlName: 'التقويم',
    icon: () => <img src="/assets/NotificationsActive.svg" alt="Notifications" style={{width: '100%', height: '100%'}} />,
    component: NotificationMobileView,
    layout: '/',
    requiresAuth: true,
  },
  {
    path: 'profile',
    name: 'My Profile',
    rtlName: 'الحاجيات',
    icon: ProfileAvatar,
    component: Profile,
    layout: '/',
    requiresAuth: true,
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
    path: 'controlpanel',
    name: 'Control Panel',
    component: ControlPanel,
    layout: '/',
    requiresAuth: true,
  },
]
export default routes
