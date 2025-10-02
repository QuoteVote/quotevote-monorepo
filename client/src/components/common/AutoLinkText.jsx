import React, { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import LinkifyIt from 'linkify-it'
import DOMPurify from 'dompurify'

// Initialize linkify with only http/https protocols
const linkify = new LinkifyIt()
  .tlds(true) // Load valid top-level domains
  .add('www.', {
    validate: (text, pos, self) => {
      const tail = text.slice(pos)
      if (!tail) return 0
      const match = self.re.src_http.exec('http://' + tail)
      return match ? match[0].length - 'http://'.length : 0
    }
  })

function normalizeHref(rawUrl) {
  if (!rawUrl) return ''
  const trimmed = rawUrl.trim()
  const hasProtocol = /^https?:\/\//i.test(trimmed)
  const candidate = hasProtocol ? trimmed : `https://${trimmed.replace(/^www\./i, 'www.')}`
  try {
    const url = new URL(candidate)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return ''
    // Sanitize the full href string
    return DOMPurify.sanitize(url.toString(), { ALLOWED_URI_REGEXP: /^(?:(?:https?):)/i })
  } catch (_) {
    return ''
  }
}

function AutoLinkText({
  text,
  className,
  style,
  linkClassName,
  linkStyle,
  truncate = false,
  maxLines = 2,
}) {
  const content = typeof text === 'string' ? text : ''

  const nodes = useMemo(() => {
    if (!content) return [content]
    const matches = linkify.match(content) || []
    if (matches.length === 0) return [content]

    const parts = []
    let lastIndex = 0
    matches.forEach((m, idx) => {
      // Push preceding text
      if (m.index > lastIndex) {
        parts.push(content.slice(lastIndex, m.index))
      }

      const displayText = content.slice(m.index, m.lastIndex)
      const href = normalizeHref(m.url || displayText)

      if (href) {
        parts.push(
          <a
            key={`autolink-${idx}-${m.index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={href}
            className={linkClassName}
            style={{
              ...linkStyle,
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
              textDecorationThickness: 'from-font',
            }}
          >
            {displayText}
          </a>
        )
      } else {
        // If not a safe href, render as plain text
        parts.push(displayText)
      }

      lastIndex = m.lastIndex
    })

    // Push remaining text
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex))
    }
    return parts
  }, [content, linkClassName, linkStyle])

  const wrapperStyle = useMemo(() => ({
    ...style,
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
    ...(truncate ? {
      display: '-webkit-box',
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    } : null),
  }), [style, truncate, maxLines])

  return (
    <Fragment>
      <span className={className} style={wrapperStyle}>
        {nodes}
      </span>
    </Fragment>
  )
}

AutoLinkText.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  linkClassName: PropTypes.string,
  linkStyle: PropTypes.object,
  truncate: PropTypes.bool,
  maxLines: PropTypes.number,
}

export default AutoLinkText


