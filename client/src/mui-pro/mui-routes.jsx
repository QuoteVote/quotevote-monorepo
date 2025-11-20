import ErrorPage from "mui-pro/views/Pages/ErrorPage.jsx";
import LoginPage from "views/LoginPage/LoginPage";
import RequestAccessPage from "views/RequestAccessPage/RequestAccessPage";

import Image from "@material-ui/icons/Image";
import LandingPage from "../views/LandingPage/LandingPage";
import PlanPage from "../views/PlanPage/PlanPage";
import InvestorThanks from "../views/InvestorThanks/InvestorThanks";
import ForgotPasswordPage from "../views/ForgotPassword/ForgotPasswordPage";
import PasswordResetPage from "../views/PasswordResetPage/PasswordResetPage";
import SignupPage from "../views/SignupPage/SignupPage";
import AboutPage from "../views/AboutPage";
import PlanCarouselPage from "../views/PlanCarouselPage/PlanCarouselPage";
import TermsPage from "../views/TermsPage";

const dashRoutes = [
  {
    collapse: true,
    name: 'Pages',
    rtlName: 'صفحات',
    icon: Image,
    state: 'pageCollapse',
    views: [
      {
        path: '/landing-page',
        name: 'Landing Page',
        rtlName: 'هعذاتسجيل الدخول',
        mini: 'L',
        rtlMini: 'هعذا',
        component: LandingPage,
        layout: '/auth',
        hideNavbar: true,
      },
      {
        path: '/about',
        name: 'About Page',
        rtlName: 'هعذاتسجيل الدخول',
        mini: 'L',
        rtlMini: 'هعذا',
        component: AboutPage,
        layout: '/auth',
      },
      {
        path: '/terms',
        name: 'Terms of Service',
        rtlName: 'هعذاتسجيل الدخول',
        mini: 'T',
        rtlMini: 'هعذا',
        component: TermsPage,
        layout: '/auth',
      },
      {
        path: '/investor-thanks',
        name: 'Investor Thanks',
        rtlName: 'هعذاتسجيل الدخول',
        mini: 'L',
        rtlMini: 'هعذا',
        component: InvestorThanks,
        layout: '/auth',
      },
      {
        path: '/login',
        name: 'Login',
        rtlName: 'هعذاتسجيل الدخول',
        mini: 'L',
        rtlMini: 'هعذا',
        component: LoginPage,
        layout: '/auth',
      },
      {
        path: '/request-access',
        name: 'Request Access Page',
        component: RequestAccessPage,
        layout: '/auth',
      },
      {
        path: '/invite',
        name: 'Request Invite',
        component: RequestAccessPage,
        layout: '/',
      },
      {
        path: '/learn-more',
        name: 'Learn More Page',
        component: PlanPage,
        layout: '/auth',
      },
      {
        path: '/plans',
        name: 'Plan Carousel Page',
        component: PlanCarouselPage,
        layout: '/auth',
      },
      {
        path: '/error-page',
        name: 'Error Page',
        rtlName: 'صفحة الخطأ',
        mini: 'E',
        rtlMini: 'البريد',
        component: ErrorPage,
        layout: '/auth',
      },
      {
        path: '/forgot',
        name: 'Forgot Password',
        rtlName: 'هعذاتسجيل الدخول',
        mini: 'L',
        rtlMini: 'هعذا',
        component: ForgotPasswordPage,
        layout: '/auth',
      },
      {
        path: '/password-reset',
        name: 'Password Reset',
        rtlName: 'هعذاتسجيل الدخول',
        mini: 'L',
        rtlMini: 'هعذا',
        component: PasswordResetPage,
        layout: '/auth',
      },
      {
        path: '/signup',
        name: 'Signup',
        rtlName: 'هعذاتسجيل الدخول',
        mini: 'L',
        rtlMini: 'هعذا',
        component: SignupPage,
        layout: '/auth',
      },
    ],
  },
]
export default dashRoutes
