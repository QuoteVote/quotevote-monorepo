import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

/**
 * Component for managing SEO meta tags including pagination
 * Uses native DOM manipulation instead of react-helmet
 */
function SEOHead({
  title,
  description,
  canonicalUrl,
  prevUrl,
  nextUrl,
  keywords,
  ogImage,
  ogType = 'website',
  noIndex = false,
}) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title
    }

    // Helper function to update or create meta tag
    const updateMetaTag = (selector, content, attribute = 'content') => {
      let element = document.querySelector(selector)
      if (element) {
        element.setAttribute(attribute, content)
      } else {
        element = document.createElement('meta')
        if (selector.startsWith('meta[name=')) {
          const name = selector.match(/meta\[name="([^"]+)"/)[1]
          element.setAttribute('name', name)
        } else if (selector.startsWith('meta[property=')) {
          const property = selector.match(/meta\[property="([^"]+)"/)[1]
          element.setAttribute('property', property)
        }
        element.setAttribute(attribute, content)
        document.head.appendChild(element)
      }
    }

    // Helper function to update or create link tag
    const updateLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`)
      if (element) {
        element.setAttribute('href', href)
      } else {
        element = document.createElement('link')
        element.setAttribute('rel', rel)
        element.setAttribute('href', href)
        document.head.appendChild(element)
      }
    }

    // Update basic meta tags
    if (description) {
      updateMetaTag('meta[name="description"]', description)
    }
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', keywords)
    }

    // Update canonical URL
    if (canonicalUrl) {
      updateLinkTag('canonical', canonicalUrl)
    }

    // Update pagination links
    if (prevUrl) {
      updateLinkTag('prev', prevUrl)
    }
    if (nextUrl) {
      updateLinkTag('next', nextUrl)
    }

    // Update Open Graph tags
    if (title) {
      updateMetaTag('meta[property="og:title"]', title)
    }
    if (description) {
      updateMetaTag('meta[property="og:description"]', description)
    }
    if (canonicalUrl) {
      updateMetaTag('meta[property="og:url"]', canonicalUrl)
    }
    if (ogImage) {
      updateMetaTag('meta[property="og:image"]', ogImage)
    }
    updateMetaTag('meta[property="og:type"]', ogType)
    updateMetaTag('meta[property="og:site_name"]', 'Quote.Vote')

    // Update Twitter Card tags
    if (title) {
      updateMetaTag('meta[name="twitter:title"]', title)
    }
    if (description) {
      updateMetaTag('meta[name="twitter:description"]', description)
    }
    if (ogImage) {
      updateMetaTag('meta[name="twitter:image"]', ogImage)
    }
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image')

    // Update robots meta
    if (noIndex) {
      updateMetaTag('meta[name="robots"]', 'noindex, nofollow')
    }

    // Cleanup function to remove dynamic meta tags when component unmounts
    return () => {
      // Remove pagination links
      const prevLink = document.querySelector('link[rel="prev"]')
      if (prevLink) {
        prevLink.remove()
      }
      const nextLink = document.querySelector('link[rel="next"]')
      if (nextLink) {
        nextLink.remove()
      }
    }
  }, [title, description, canonicalUrl, prevUrl, nextUrl, keywords, ogImage, ogType, noIndex])

  // This component doesn't render anything visible
  return null
}

SEOHead.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonicalUrl: PropTypes.string,
  prevUrl: PropTypes.string,
  nextUrl: PropTypes.string,
  keywords: PropTypes.string,
  ogImage: PropTypes.string,
  ogType: PropTypes.string,
  noIndex: PropTypes.bool,
}

export default SEOHead
