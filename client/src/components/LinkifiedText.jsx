import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Typography, Link } from '@material-ui/core';
import linkifyIt from 'linkify-it';
import DOMPurify from 'dompurify';


const linkify = linkifyIt()
  .tlds([], false) 
  .add('http:', 'http:')
  .add('https:', 'https:');

const LinkifiedText = ({ text, variant = 'body1', className = '' }) => {
  
  const content = useMemo(() => {
    if (!text) return null;

    
    const matches = linkify.match(text);

    
    if (!matches) {
      return <>{text}</>;
    }

    const elements = [];
    let lastIndex = 0;

   
    matches.forEach((match, i) => {
      
      if (match.index > lastIndex) {
        elements.push(text.slice(lastIndex, match.index));
      }

      
      const safeUrl = DOMPurify.sanitize(match.url, { ALLOWED_TAGS: [] }); 
      
      
      const displayUrl = match.text.length > 50 ? `${match.text.slice(0, 47)}...` : match.text;

      
      elements.push(
        <Link
          key={i}
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          underline="hover"
        >
          {displayUrl}
        </Link>
      );

      lastIndex = match.lastIndex;
    });

    
    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
    }

    return elements;
  }, [text]);

  return (
    <Typography variant={variant} className={className} component="span">
      {content}
    </Typography>
  );
};

LinkifiedText.propTypes = {
  text: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string,
};

export default LinkifiedText;