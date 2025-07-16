const getCardBackgroundColor = (activityType) => {
  switch (activityType.toUpperCase()) {
    case 'POSTED':
      return '#FFFFFF'
    case 'COMMENTED':
      return '#FDD835'
    case 'UPVOTED':
      return '#52b274'
    case 'DOWNVOTED':
      return '#FF6060'
    case 'LIKED':
      return '#F16C99'
    case 'QUOTED':
      return '#E36DFA'
    default:
      return '#FFFFFF'
  }
}

export default getCardBackgroundColor
