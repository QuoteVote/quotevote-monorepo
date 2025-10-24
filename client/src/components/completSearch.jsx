import GridContainer from 'mui-pro/Grid/GridContainer'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'

export default function CompleteSearch() {
  return (
    <GridContainer
      direction="row"
      justify="center"
      alignItems="center"
    >
      <GridContainer alignItems="center" direction="row" style={{ width: '50%' }}>
        <Slider
          value={30}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
        />

      </GridContainer>
      <br />
      <Box boxShadow={3} style={{ display: 'flex', backgroundColor: '#2A6797', width: '75%' }}>
        <GridContainer
          alignItems="center"
          justify="space-between"
          direction="row"
        >

          <h3
            style={{
              color: 'white', font: 'League Spartan', fontWeight: 'bold', paddingLeft: '20px', paddingBottom: '5px',
            }}
          >
            Trending
          </h3>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div />
            <img alt="Calender Icon" src="/assets/Calendar.svg" style={{ height: '40px', paddingLeft: '15px' }} />
            <img alt="Filter icon" src="/assets/Filter.svg" style={{ height: '40px', paddingLeft: '15px' }} />
            <img alt="Emoji icon" src="/assets/FollowingEmoji.svg" style={{ height: '40px', paddingLeft: '15px' }} />
          </div>

        </GridContainer>
      </Box>
    </GridContainer>
  )
}
