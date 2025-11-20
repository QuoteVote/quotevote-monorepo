// Light and Dark theme configurations for QuoteVote
// Maintains brand colors (#52b274 primary green) while ensuring accessibility

export const lightTheme = {
    palette: {
        mode: 'light',
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
        mode: 'dark',
        primary: {
            main: '#52b274',
            light: '#66BB6A',
            dark: '#388E3C',
            contrastText: '#F5F5F5',
        },
        secondary: {
            main: '#E91E63',
            light: '#F06292',
            dark: '#C2185B',
            contrastText: '#F5F5F5',
        },
        background: {
            default: '#0F0F0F',
            paper: '#1A1A1A',
        },
        surface: {
            main: '#1F1F1F',
            light: '#2A2A2A',
            dark: '#161616',
        },
        text: {
            primary: '#EDEDED',
            secondary: '#B3B3B3',
            disabled: '#6F6F6F',
            muted: '#8A8A8A',
        },
        divider: 'rgba(255, 255, 255, 0.06)',
        border: 'rgba(255, 255, 255, 0.08)',
        error: {
            main: '#EF5350',
            light: '#E57373',
            dark: '#C62828',
        },
        warning: {
            main: '#FFA726',
            light: '#FFB74D',
            dark: '#E65100',
        },
        info: {
            main: '#29B6F6',
            light: '#64B5F6',
            dark: '#0277BD',
        },
        success: {
            main: '#66BB6A',
            light: '#81C784',
            dark: '#2E7D32',
        },
        action: {
            hover: 'rgba(255, 255, 255, 0.08)',
            selected: 'rgba(255, 255, 255, 0.12)',
            disabled: 'rgba(255, 255, 255, 0.04)',
        },
    },
    // Custom theme properties for QuoteVote (adjusted for dark mode)
    activityCards: {
        quoted: {
            color: '#E36DFA',
            fontColor: '#F5F5F5',
        },
        commented: {
            color: '#FFD54F',
            fontColor: '#0F0F0F',
        },
        upvote: {
            color: '#66BB6A',
            fontColor: '#F5F5F5',
        },
        downvote: {
            color: '#EF5350',
            fontColor: '#F5F5F5',
        },
        submitted: {
            color: '#424242',
            fontColor: '#F5F5F5',
        },
        hearted: {
            color: '#F06292',
            fontColor: '#F5F5F5',
        },
        posted: {
            color: '#2D2D2D',
            fontColor: '#F5F5F5',
        },
        trending: {
            color: '#29B6F6',
            fontColor: '#F5F5F5',
        },
    },
    subHeader: {
        activeIcon: {
            color: '#66BB6A',
        },
        default: {
            color: '#F5F5F5',
        },
        followButton: {
            backgroundColor: '#52b274',
            color: '#F5F5F5',
        },
    },
    activityCardsComplete: {
        peach: '#EF5350',
        greenSecondary: '#66BB6A',
        lightblueCard: '#29B6F6',
        orange: '#FFA726',
        gray1: '#808080',
        downvotedCardAndError: '#EF5350',
        blackCard: '#2D2D2D',
        greenPrimary: '#52b274',
        heartedPinkCard: '#F06292',
        backgroundOffWhite: '#252525',
        mintyGreen: '#66BB6A',
        subsectionTitleMutedBlack: '#B0B0B0',
        blue: '#64B5F6',
        yellow: '#FFD54F',
        red: '#EF5350',
        violet: '#E36DFA',
        purple: '#BA68C8',
        gray2inactive: '#606060',
    },
    alerts: {
        info: '#29B6F6',
        success: '#66BB6A',
        warning: '#FFA726',
        danger: '#EF5350',
        primary: '#BA68C8',
    },
}
