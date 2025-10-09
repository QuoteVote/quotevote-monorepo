import React from 'react'
import Paper from '@mui/material/Paper'

import BuddyList from './index'

export default {
  component: BuddyList,
  title: 'Chat',
}

export const Base = () => (
  <Paper
    style={{
      width: 400,
      backgroundImage: 'linear-gradient(224.94deg, #1BB5D8 1.63%, #4066EC 97.6%)',
    }}
  >
    <BuddyList />
  </Paper>
)
