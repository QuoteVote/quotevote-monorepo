import lightBlue from '@material-ui/core/colors/lightBlue'
import teal from '@material-ui/core/colors/teal'

const theme = {
  palette: {
    primary: {
      main: '#fff',
      contrastText: '#52b274',
    },
    secondary: {
      main: '#52b274',
      contrastText: '#fff',
    },
    background: {
      default: '#EEF4F9',
    },
  },
  activityCards: {
    quoted: {
      color: '#E36DFA',
      fontColor: '#000000',
    },
    commented: {
      color: '#FDD835',
      fontColor: '#000000',
    },
    upvote: {
      color: '#52b274',
      fontColor: '#000000',
    },
    downvote: {
      color: '#FF6060',
      fontColor: '#000000',
    },
    submitted: {
      color: '#000000',
      fontColor: '#000000',
    },
    hearted: {
      color: '#F16C99',
      fontColor: '#000000',
    },
    posted: {
      color: '#FFFFFF',
      fontColor: '#000000',
    },
    trending: {
      color: lightBlue[500],
      fontColor: '#000000',
    },
  },
  subHeader: {
    activeIcon: {
      color: teal.A400,
    },
    default: {
      color: 'black',
    },
    followButton: {
      backgroundColor: '#52b274',
      color: 'white',
    },
  },
  activityCardsComplete: {
    peach: '#F44336',
    greenSecondary: '#4CAF50',
    // gray: rgba(25, 25, 25, 0.77),
    lightblueCard: '#00BCD4',
    orange: '#FF9801',
    gray1: '#454545',
    downvotedCardAndError: '#DA3849',
    blackCard: '#2D2A2A',
    greenPrimary: '#52b274',
    heartedPinkCard: '#F16C99',
    backgroundOffWhite: '#FAFAFA',
    mintyGreen: '#00E676',
    subsectionTitleMutedBlack: '#424556',
    blue: '#56B3FF',
    yellow: '#FEC02F',
    red: '#FF6060',
    violet: '#E36DFA',
    purple: '#791E89',
    gray2inactive: '#D8D8D8',
  },
  alerts: {
    info: '#00CAE3',
    success: '#55B559',
    warning: '#FF9E0F',
    danger: '#F55145',
    primary: '#A72ABD',
  },
}

export default theme
