/* eslint-disable react/prop-types */
import { Fragment, useState } from 'react'
import { Container } from '@mui/material'

import { parser } from 'utils/parser'
import Highlighter from 'react-highlight-words'
import { useSelector } from 'react-redux'
import { makeStyles } from '@mui/styles'
import SelectionPopover from './SelectionPopover'

const useStyles = makeStyles({
  root: {
    backgroundColor: '#52b274',
    color: 'white',
  },
})
const VotingBoard = ({
  topOffset,
  onSelect,
  highlights,
  content,
  children,
  votes = [],
  ...props
}) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [selection, setSelection] = useState({})
  const focusedComment = useSelector((state) => state.ui.focusedComment)
  const { startWordIndex, endWordIndex } = focusedComment || { startWordIndex: 0, endWordIndex: 0 }
  const highlightedText = content.substring(startWordIndex, endWordIndex).replace(/(\r\n|\n|\r)/gm, '')

  console.log({
    startWordIndex,
    endWordIndex,
    highlightedText,
    focusedComment,
  })
  
  const handleSelect = (select) => {
    const text = select.toString()

    if (!text) return
    const selectionVal = parser(content, text, select)

    if (text.length > 0 && onSelect) {
      setOpen(true)
      setSelection(selectionVal)
      onSelect(selectionVal)
    } else {
      setSelection({})
    }
  }
  
  const findChunksAtBeginningOfWords = () => ([{ start: startWordIndex > 0 ? startWordIndex : 0, end: endWordIndex }])

  const disableContextMenu = (e) => {
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()
  }
  
  const renderHighlights = () => {
    if (highlights) {
      // If there's a focused comment, highlight it
      if (endWordIndex > startWordIndex) {
        return (
          <Highlighter
            style={{
              whiteSpace: 'pre-line',
            }}
            highlightClassName={classes.root}
            textToHighlight={content}
            findChunks={findChunksAtBeginningOfWords}
            autoEscape
            onContextMenu={disableContextMenu}
          />
        )
      }

      return (
        <Highlighter
          style={{
            whiteSpace: 'pre-line',
          }}
          highlightClassName={classes.root}
          searchWords={[highlightedText]}
          textToHighlight={content}
          autoEscape
          caseSensitive
          onContextMenu={disableContextMenu}
        />
      )
    }

    return content.split(/\n/g).map((line, contentIndex) => (
      <Fragment key={`frag-${contentIndex}`}>
        {line.split(/\s+/g).map((word, index) => (
          <span key={index + word}>{`${word} `}</span>
        ))}
        <br />
      </Fragment>
    ));
  }

  return (
    <Container>
      <div data-selectable>
        <p
          className="voting_board-content"
          onContextMenu={disableContextMenu}
        >
          {renderHighlights()}
        </p>
      </div>
      <SelectionPopover
        showPopover={open}
        topOffset={topOffset}
        onSelect={handleSelect}
        onDeselect={() => setOpen(false)}
      >
        {props && children({ ...selection })}
      </SelectionPopover>
    </Container>
  )
}

export default VotingBoard
