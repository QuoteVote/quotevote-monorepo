// Light and Dark theme configurations for QuoteVote
// Maintains brand colors (#52b274 primary green) while ensuring accessibility

export const lightTheme = {
    palette: {
        type: 'light',
        primary: {
            main: '#52b274',
            contrastText: '#fff',
        },
        secondary: {
            main: '#E91E63',
            contrastText: '#fff',
        },
        background: {
            default: '#EEF4F9',
            paper: '#ffffff',
        },
        text: {
            primary: '#000000',
            secondary: 'rgba(0, 0, 0, 0.6)',
        },
        divider: 'rgba(0, 0, 0, 0.12)',
    },
    // Custom theme properties for QuoteVote
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
            color: '#03A9F4',
            fontColor: '#000000',
        },
    },
    subHeader: {
        activeIcon: {
            color: '#1DE9B6',
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

export const darkTheme = {
    palette: {
        type: 'dark',
        primary: {
            main: '#52b274',
            contrastText: '#fff',
        },
        secondary: {
            main: '#E91E63',
            contrastText: '#fff',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
        divider: 'rgba(255, 255, 255, 0.12)',
    },
    // Custom theme properties for QuoteVote (adjusted for dark mode)
    activityCards: {
        quoted: {
            color: '#E36DFA',
            fontColor: '#ffffff',
        },
        commented: {
            color: '#FDD835',
            fontColor: '#000000',
        },
        upvote: {
            color: '#52b274',
            fontColor: '#ffffff',
        },
        downvote: {
            color: '#FF6060',
            fontColor: '#ffffff',
        },
        submitted: {
            color: '#424242',
            fontColor: '#ffffff',
        },
        hearted: {
            color: '#F16C99',
            fontColor: '#ffffff',
        },
        posted: {
            color: '#2D2A2A',
            fontColor: '#ffffff',
        },
        trending: {
            color: '#03A9F4',
            fontColor: '#ffffff',
        },
    },
    subHeader: {
        activeIcon: {
            color: '#1DE9B6',
        },
        default: {
            color: 'white',
        },
        followButton: {
            backgroundColor: '#52b274',
            color: 'white',
        },
    },
    activityCardsComplete: {
        peach: '#F44336',
        greenSecondary: '#4CAF50',
        lightblueCard: '#00BCD4',
        orange: '#FF9801',
        gray1: '#757575',
        downvotedCardAndError: '#DA3849',
        blackCard: '#424242',
        greenPrimary: '#52b274',
        heartedPinkCard: '#F16C99',
        backgroundOffWhite: '#2D2A2A',
        mintyGreen: '#00E676',
        subsectionTitleMutedBlack: '#B0B0B0',
        blue: '#56B3FF',
        yellow: '#FEC02F',
        red: '#FF6060',
        violet: '#E36DFA',
        purple: '#791E89',
        gray2inactive: '#616161',
    },
    alerts: {
        info: '#00CAE3',
        success: '#55B559',
        warning: '#FF9E0F',
        danger: '#F55145',
        primary: '#A72ABD',
    },
}
