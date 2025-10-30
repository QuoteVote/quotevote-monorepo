# User Manual Screenshots Guide

This directory contains screenshots and visual assets for the Quote.Vote User Manual.

## Required Screenshots

The following screenshots need to be captured and added to this directory:

### 1. Request Invite Form (`request-invite-form.png`)
**Location**: Homepage → "Request Invite" button  
**What to capture**: The invite request form showing email field and submit button  
**Alt text**: "Quote.Vote invite request form with email input field and submit button"  
**Dimensions**: 800x600px recommended

### 2. Signup Form (`signup-form.png`)
**Location**: Signup page (accessed via invite link)  
**What to capture**: Username, password fields, and terms checkbox  
**Alt text**: "Quote.Vote signup form with username and password fields"  
**Dimensions**: 800x600px recommended

### 3. Voting Interface (`voting-interface.png`)
**Location**: Any post page  
**What to capture**: Post content with upvote/downvote buttons visible next to paragraphs  
**Alt text**: "Voting buttons displayed next to post paragraphs with vote counts"  
**Dimensions**: 1200x800px recommended

### 4. Post Creation Form (`post-creation-form.png`)
**Location**: Click "Create Post" or "Submit" from navigation  
**What to capture**: Full form with title, content, tags, citation URL, and AI indicator fields  
**Alt text**: "Post creation form showing title, content editor, tags, and citation fields"  
**Dimensions**: 1200x900px recommended

### 5. Text Selection and Quote Button (`quote-selection.png`)
**Location**: Any post with text selected  
**What to capture**: Highlighted text with "Quote" button appearing  
**Alt text**: "Selected text highlighted with Quote button overlay"  
**Dimensions**: 800x400px recommended

### 6. Comment Form (`comment-form.png`)
**Location**: Bottom of any post  
**What to capture**: Comment textarea and post button  
**Alt text**: "Comment form with text input area and submit button"  
**Dimensions**: 800x300px recommended

### 7. Chat Room Interface (`chat-room.png`)
**Location**: Post page → "Join Chat" button  
**What to capture**: Chat panel showing messages, user presence, and input field  
**Alt text**: "Real-time chat room interface with message history and active users"  
**Dimensions**: 400x600px recommended

### 8. Search Interface (`search-interface.png`)
**Location**: Click search icon in navigation  
**What to capture**: Search bar, filters, and results  
**Alt text**: "Search interface with query input, filters, and result list"  
**Dimensions**: 1200x800px recommended

### 9. User Profile Page (`user-profile.png`)
**Location**: Click any username  
**What to capture**: Profile header, stats, and recent activity  
**Alt text**: "User profile page showing bio, statistics, and recent posts"  
**Dimensions**: 1200x900px recommended

### 10. Report Dialog (`report-dialog.png`)
**Location**: Click report icon on any post/comment  
**What to capture**: Report modal with reason selection and submit button  
**Alt text**: "Content report dialog with reason dropdown and submit button"  
**Dimensions**: 600x400px recommended

### 11. Settings Page (`settings-page.png`)
**Location**: Profile menu → Settings  
**What to capture**: Settings navigation and account settings panel  
**Alt text**: "Settings page showing account, appearance, and privacy options"  
**Dimensions**: 1200x800px recommended

## Screenshot Guidelines

### Capture Requirements
- **Resolution**: Use high-DPI displays (2x or higher) for crisp images
- **Browser**: Use latest Chrome or Firefox
- **Window size**: 1920x1080 for desktop screenshots, 375x812 for mobile
- **Clean state**: Use test accounts, clear notifications, hide personal data
- **Annotations**: Add arrows or highlights for key UI elements (optional)

### File Naming Convention
- Use kebab-case: `feature-name-description.png`
- Include state if relevant: `post-form-filled.png`, `post-form-empty.png`
- Add `-mobile` suffix for mobile screenshots: `voting-interface-mobile.png`

### Image Optimization
Before committing, optimize images:
```bash
# Using ImageOptim (Mac)
imageoptim *.png

# Using pngquant (cross-platform)
pngquant --quality=65-80 *.png

# Using TinyPNG API
tinypng *.png
```

### Alt Text Requirements
Every screenshot must have:
- Descriptive alt text (not just filename)
- Context about what the screenshot shows
- Key interactive elements mentioned
- No redundant phrases like "screenshot of" or "image showing"

## Adding Screenshots to Documentation

### Markdown Syntax
```markdown
![Alt text description](./assets/screenshot-name.png)
```

### With Caption
```markdown
![Alt text description](./assets/screenshot-name.png)
*Figure 1: Caption describing the screenshot*
```

### Responsive Images (Optional)
```markdown
<picture>
  <source media="(max-width: 768px)" srcset="./assets/screenshot-mobile.png">
  <img src="./assets/screenshot-desktop.png" alt="Alt text description">
</picture>
```

## Placeholder Images

Until real screenshots are captured, placeholders are indicated in the documentation with:
```markdown
![Screenshot placeholder: Description of what should be captured]
```

## Contributing Screenshots

To contribute screenshots:

1. **Capture** screenshots following the guidelines above
2. **Optimize** images to reduce file size
3. **Name** files according to the convention
4. **Add** to this directory
5. **Update** the User Manual to replace placeholders
6. **Commit** with message: `docs: add user manual screenshot for [feature]`

## Testing Screenshots

Before committing, verify:
- [ ] Image loads correctly in markdown preview
- [ ] Alt text is descriptive and helpful
- [ ] File size is reasonable (<500KB per image)
- [ ] Image is clear and readable
- [ ] No personal or sensitive information visible
- [ ] Annotations (if any) are clear and professional

## Questions?

If you need help capturing screenshots or have questions about the guidelines, please:
- Open an issue on GitHub
- Ask in the community Discord
- Email: admin@quote.vote

---

**Note**: This is a living document. Update it as new screenshots are needed or guidelines change.
