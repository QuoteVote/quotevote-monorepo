import React from 'react'

// Minimal shim for react-material-ui-carousel used during tests.
// Exposes a default Carousel component that simply renders children inside
// a div and preserves a couple of props used by the app (e.g., indicators).
export default function Carousel({ children }) {
  return React.createElement('div', { 'data-testid': 'carousel' }, children)
}

// Also export a named component for consumers importing the named export.
export const CarouselComponent = Carousel
