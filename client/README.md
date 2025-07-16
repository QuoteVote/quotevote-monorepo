# Quote Vote

Quote.Vote is a text-first platform for public dialogue,  
where every post becomes a space for quoting, reflecting, and voting on ideas.  

Contributors from around the world helped build this civic engagement tool—  
without ads or algorithms, we can have transparent conversation.  

Features such as targeted feedback via text highlights, public chat threads,  
and voting mechanics support thoughtful interaction over reactive engagement.  

Originally prototyped as Scoreboard, the project is now in preparation for open-source  
and our team welcomes remix, reuse, and contributions from developers, designers,  
and democratic technologists alike.

## Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Features](#features)
  - [Home Page](#1-home-page)
  - [Post Creation Page](#2-post-creation-page)
  - [Content Page](#3-content-page)
  - [Search Page](#4-search-page)
  - [User Profile Page](#5-user-profile-page)
  - [Activity Feed](#6-activity-feed)
- [GraphQL API Documentation](#graphql-api-documentation)
- [Feature Development](#feature-development)
- [Storybook Guide](docs/storybook-guide.md)
- [Contributing](#contributing)

## Requirements
  - If working on a mac, you will need to have Xcode properly installed for your current OS version.


## Installation
 Ensure the backend is running. Follow the [instructions.](https://github.com/QuoteVote/quotevote-api/blob/dev/README.md)
 

2. Clone the repository

    `git clone https://github.com/QuoteVote/quotevote-react.git && cd quotevote-react`
3. Create a `.env` file and add the following:
    ```
    NODE_ENV=dev
    REACT_APP_SERVER=https://api.quote.vote
    REACT_APP_SERVER_WS=wss://api.quote.vote
    REACT_APP_DOMAIN=https://quote.vote
    ```

3. Install dependencies

    `npm install --legacy-peer-deps`

3. Run the application

    `npm run start:dev`

## Features

### 1. Home Page

**Components & Features**

- **Navigation Bar**
  - **Logo and Branding:** Clicking the logo returns the user to the home page from anywhere in the app.
  - **Search Functionality:** Users can type keywords or phrases into the search bar. As they type, a dropdown menu appears, suggesting relevant users, posts, and subscoreboards. Selecting a suggestion navigates directly to that entity. Pressing enter or clicking "See all results" brings up a search results page with matches ranked by relevance.
  - **User Account Access:** Clicking the user avatar or name opens a dropdown with links to the profile, settings, and logout.
  - **Notification Indicator:** A bell icon displays a badge with the count of unread notifications. Clicking it opens a panel listing recent notifications, each linking to the relevant post, comment, or user.

- **Feed Container**
  - **Followed Users' Posts:** Displays a chronological feed of posts from users the current user follows. Each post preview includes author, timestamp, subscoreboard, and engagement metrics.
  - **Recommended Content:** Below or interleaved with followed users' posts, the feed suggests posts from outside the user's network, based on trending topics or shared interests.
  - **Real-Time Updates:** New posts and interactions appear in the feed without requiring a page refresh, using WebSockets or GraphQL subscriptions.

- **Trending Section**
  - **Popular Discussions:** A sidebar or horizontal strip highlights posts with the most engagement in the last 24 hours.
  - **Trending Topics:** Displays a list of hashtags or subscoreboards currently experiencing high activity. Clicking a topic filters the feed to show related posts.
  - **Active Communities:** Shows subscoreboards with the most new posts or comments, encouraging users to explore new areas.

**User Stories**

**Navigation Bar**
- As a user, I want to click the logo to return to the home page so that I can easily navigate back from anywhere.
  - *Acceptance Criteria:*
    - Clicking the logo always navigates to the home page.
- As a user, I want to search for users, posts, or subscoreboards so that I can quickly find relevant content.
  - *Acceptance Criteria:*
    - Typing in the search bar shows suggestions for users, posts, and subscoreboards.
    - Selecting a suggestion navigates to the correct page.
    - Pressing enter or "See all results" shows a search results page ranked by relevance.
- As a user, I want to access my account options so that I can view my profile, change settings, or log out.
  - *Acceptance Criteria:*
    - Clicking the avatar/name opens a dropdown with profile, settings, and logout.
    - Each option navigates to the correct page or performs the correct action.
- As a user, I want to see notifications so that I can respond to new activity.
  - *Acceptance Criteria:*
    - A bell icon displays the count of unread notifications.
    - Clicking the icon opens a panel with recent notifications, each linking to the relevant content.

**Feed Container**
- As a user, I want to see posts from people I follow so that I can stay updated on their activities.
  - *Acceptance Criteria:*
    - The feed displays posts from followed users in chronological order.
- As a user, I want to see recommended content so that I can discover new discussions.
  - *Acceptance Criteria:*
    - The feed includes posts from outside my network based on trending topics or interests.
- As a user, I want the feed to update in real time so that I don't miss new posts or interactions.
  - *Acceptance Criteria:*
    - New posts and interactions appear without a page refresh.

**Trending Section**
- As a user, I want to see popular discussions so that I can join active conversations.
  - *Acceptance Criteria:*
    - A section highlights posts with the most engagement in the last 24 hours.
- As a user, I want to see trending topics so that I can explore what's currently popular.
  - *Acceptance Criteria:*
    - Trending topics are displayed and clickable, filtering the feed.
- As a user, I want to see active communities so that I can find new areas to participate in.
  - *Acceptance Criteria:*
    - Subscoreboards with the most new posts/comments are shown and are clickable.

---

### 2. Post Creation Page

**Components & Features**

- **Post Editor**
  - **Rich Text Formatting:** Users can format text (bold, italics, lists, code blocks) using a toolbar or markdown syntax. The editor supports undo/redo and keyboard shortcuts.
  - **Media Attachment Options:** Users can upload images, videos, or files via drag-and-drop or file picker. Thumbnails or previews are shown inline.
  - **Preview Functionality:** A toggle or side-by-side view lets users see how their post will appear once published, including formatting and media.

- **Subscoreboard Selector**
  - **Dropdown for Selection:** Users choose a subscoreboard from a searchable dropdown. The list is filtered as the user types.
  - **Create New Subscoreboard:** If no relevant subscoreboard exists, users can create one by entering a name and description, subject to moderation or approval.

- **Publishing Controls**
  - **Draft Saving:** Posts are auto-saved as drafts. Users can manually save and return later to finish editing.
  - **Publication Settings:** Users can set the post as public, private, or restricted to certain subscoreboards.
  - **Visibility Options:** Users can choose to allow or disallow comments, or schedule the post for future publication.

**User Stories**

**Post Editor**
- As a user, I want to format my post text so that I can make my content clear and engaging.
  - *Acceptance Criteria:*
    - Formatting options (bold, italics, lists, code) are available and work as expected.
- As a user, I want to attach media to my post so that I can share images or files.
  - *Acceptance Criteria:*
    - Users can upload images, videos, or files and see previews inline.
- As a user, I want to preview my post before publishing so that I can ensure it looks correct.
  - *Acceptance Criteria:*
    - A preview mode displays the post as it will appear when published.

**Subscoreboard Selector**
- As a user, I want to select a subscoreboard for my post so that it reaches the right audience.
  - *Acceptance Criteria:*
    - A searchable dropdown lists available subscoreboards.
    - Selecting a subscoreboard assigns the post to it.
- As a user, I want to create a new subscoreboard if none are relevant so that I can categorize my post appropriately.
  - *Acceptance Criteria:*
    - Users can create a new subscoreboard by entering a name and description.
    - New subscoreboards are subject to moderation or approval.

**Publishing Controls**
- As a user, I want my post to be auto-saved as a draft so that I don't lose my work.
  - *Acceptance Criteria:*
    - The editor auto-saves drafts periodically.
    - Users can manually save and return to drafts.
- As a user, I want to set the visibility of my post so that I control who can see it.
  - *Acceptance Criteria:*
    - Users can choose public, private, or restricted visibility.
- As a user, I want to allow or disallow comments or schedule my post so that I control engagement and timing.
  - *Acceptance Criteria:*
    - Users can toggle comments on/off and set a future publication date.

---

### 3. Content Page

**Components & Features**

- **Post Display**
  - **Complete Post Content:** Shows the full text and media of the post, with all formatting preserved.
  - **Author Information:** Displays the author's avatar, username, and a link to their profile. Hovering shows a mini-profile card.
  - **Timestamp and Metadata:** Shows when the post was created and last edited, and which subscoreboard it belongs to.

- **Interaction Bar**
  - **Upvote/Downvote Buttons:** Users can upvote or downvote the post. The current vote count is displayed and updates in real time. Users can change or remove their vote.
  - **Comment Counter:** Shows the number of comments. Clicking scrolls to the comment section.
  - **Quote Button:** Allows users to select text from the post and quote it in a new comment or post, with attribution.
  - **Bookmark (Pin to Buddylist) Option:** Clicking the bookmark icon pins the post chat to the user's buddylist for quick access. The icon changes state to indicate pinned status.

- **Moderation Controls**
  - **Flag Button:** All users can see a "Flag" or "Report" button on each post. Clicking this button opens a dialog where the user can select a reason (e.g., spam, harassment, inappropriate content) and optionally provide additional details. Once submitted, the post is flagged for moderator review. The button may change state to indicate the post has been flagged by the user.
  - **Support Button:** If a post is pending approval, users with moderation privileges will see a "Support" button (e.g., a green outlined button with a thumbs-up icon, as implemented in `ApproveButton.js`). Clicking this button marks the post as approved, making it visible to the wider community. The button is disabled or hidden once the post is approved.
  - **Disagree Button:** If a post is pending approval, users with moderation privileges will see a "Disagree" button (e.g., a red outlined button with a thumbs-down or similar icon, as implemented in `RejectButton.js`). Clicking this button marks the post as rejected, optionally prompting the moderator to provide a reason. The post is then hidden or removed from public view. The button is disabled or hidden once the post is rejected or approved.

- **Comment Section**
  - **Comment Entry Field:** Users can write and submit comments, with support for basic formatting and @mentions.
  - **Threaded Comments Display:** Comments are shown in a nested/threaded view, with replies indented under parent comments.
  - **Comment Sorting Options:** Users can sort comments by newest, oldest, or most upvoted. Collapsed threads can be expanded or hidden.

**User Stories**

**Post Display**
- As a user, I want to read the full content of a post so that I can understand the discussion.
  - *Acceptance Criteria:*
    - The full post, including formatting and media, is displayed.
- As a user, I want to see who authored the post and when so that I have context.
  - *Acceptance Criteria:*
    - Author avatar, username, and timestamps are shown.
    - Hovering over the author shows a mini-profile.

**Interaction Bar**
- As a user, I want to upvote or downvote a post so that I can express my opinion.
  - *Acceptance Criteria:*
    - Upvote/downvote buttons are present and update the count in real time.
    - Users can change or remove their vote.
- As a user, I want to see the number of comments so that I know how active the discussion is.
  - *Acceptance Criteria:*
    - A comment counter is visible and accurate.
- As a user, I want to quote part of a post so that I can reference it in my response.
  - *Acceptance Criteria:*
    - Users can select text and quote it in a new comment or post, with attribution.
- As a user, I want to pin a post chat to my buddylist so that I can access it quickly.
  - *Acceptance Criteria:*
    - Clicking the bookmark icon pins/unpins the post chat and updates the icon state.

**Moderation Controls**
- As a user, I want to flag inappropriate or problematic posts so that moderators can review and take action if necessary.
  - *Acceptance Criteria:*
    - A "Flag" or "Report" button is visible on every post.
    - Clicking the button opens a dialog to select a reason and provide details.
    - Submitting the form flags the post for moderator review.
    - The button or post indicates to the user that it has already been flagged by them.
- As a moderator, I want to see Support and Disagree buttons on posts pending approval so that I can moderate content directly from the post page.
  - *Acceptance Criteria:*
    - The Support and Disagree buttons are visible only to moderators for posts pending approval.
    - The Support button is styled as a green outlined button with a thumbs-up icon (per `ApproveButton.js`).
    - The Disagree button is styled as a red outlined button with a thumbs-down or similar icon (per `RejectButton.js`).
    - Clicking Support marks the post as approved and updates its status; the button is disabled or hidden after approval.
    - Clicking Disagree marks the post as rejected, optionally prompts for a reason, and updates its status; the button is disabled or hidden after rejection or approval.
- As a regular user, I should not see Support or Disagree buttons so that moderation controls are restricted to authorized users.
  - *Acceptance Criteria:*
    - Support and Disagree buttons are not rendered for non-moderator users.

**Comment Section**
- As a user, I want to comment on posts so that I can participate in the discussion.
  - *Acceptance Criteria:*
    - A comment entry field is available and supports formatting and @mentions.
- As a user, I want to reply to comments in threads so that conversations are organized.
  - *Acceptance Criteria:*
    - Comments are displayed in a nested/threaded view.
    - Replies are indented under parent comments.
- As a user, I want to sort comments so that I can view the most relevant or recent ones.
  - *Acceptance Criteria:*
    - Sorting options (newest, oldest, most upvoted) are available and functional.
    - Collapsed threads can be expanded or hidden.

---

### 4. Search Page

**Components & Features**

- **Trending Filters**
  - **Time Period Selectors:** Users can filter trending posts by day, week, or month. The UI updates to reflect the selected period.
  - **Category Filters:** Users can filter by subscoreboard or topic. Multi-select is supported for broader discovery.
  - **Sort Options:** Posts can be sorted by upvotes, comments, or recency.

- **Trending Post List**
  - **Post Previews with Engagement Metrics:** Each trending post is shown with a snippet, author, subscoreboard, upvotes, and comment count.
  - **Visual Indicators of Trending Status:** Badges or icons indicate posts that are "hot," "rising," or "new."
  - **Quick Interaction Buttons:** Users can upvote, downvote, comment, or pin the post chat to their buddylist directly from the list.

**User Stories**

**Trending Filters**
- As a user, I want to filter trending posts by time period so that I can see what's popular now or recently.
  - *Acceptance Criteria:*
    - Time period selectors (day, week, month) update the trending list accordingly.
- As a user, I want to filter by category so that I can focus on topics of interest.
  - *Acceptance Criteria:*
    - Category filters allow single or multiple selections and update the list.
- As a user, I want to sort trending posts so that I can see the most upvoted, most commented, or most recent.
  - *Acceptance Criteria:*
    - Sort options are available and update the list as expected.

**Trending Post List**
- As a user, I want to see previews of trending posts with engagement metrics so that I can decide which to read.
  - *Acceptance Criteria:*
    - Each post preview shows a snippet, author, subscoreboard, upvotes, and comment count.
- As a user, I want to see which posts are hot, rising, or new so that I can join timely discussions.
  - *Acceptance Criteria:*
    - Visual indicators (badges/icons) are present for trending status.
- As a user, I want to interact with posts directly from the list so that I can engage quickly.
  - *Acceptance Criteria:*
    - Upvote, downvote, comment, and pin-to-buddylist actions are available and functional from the list.

---

### 5. User Profile Page

**Components & Features**

- **Profile Header**
  - **User Avatar and Display Name:** Prominently displays the user's avatar and name. Clicking the avatar allows the user to upload a new image (if viewing own profile).
  - **Bio and Personal Information:** Shows a short bio, location, and links to external profiles (if provided).
  - **Following/Followers Counts:** Displays the number of users followed and followers. Clicking shows a modal or page with the full list.

- **Activity Timeline**
  - **Recent Posts:** Lists the user's most recent posts, with links to view or edit (if own profile).
  - **Comment History:** Shows a chronological list of comments made by the user, with links to the original posts.
  - **Interaction Record:** Displays a summary of upvotes, quotes, and other engagement metrics.

- **Content Collections**
  - **Created Posts:** A tab or section listing all posts authored by the user.
  - **Pinned Post Chats (via Bookmarks):** Shows all post chats the user has pinned to their buddylist, with quick links to open the chat.
  - **Quoted References:** Lists posts where the user has quoted others or been quoted, with context snippets.

**User Stories**

**Profile Header**
- As a user, I want to see my avatar and display name so that I can personalize my profile.
  - *Acceptance Criteria:*
    - Avatar and display name are shown; clicking avatar allows upload if it's my profile.
- As a user, I want to view and edit my bio and personal info so that others can learn about me.
  - *Acceptance Criteria:*
    - Bio, location, and external links are displayed and editable (if own profile).
- As a user, I want to see my following/follower counts so that I can track my network.
  - *Acceptance Criteria:*
    - Counts are accurate and clickable to view full lists.

**Activity Timeline**
- As a user, I want to see my recent posts so that I can revisit or edit them.
  - *Acceptance Criteria:*
    - Recent posts are listed with links to view or edit (if own profile).
- As a user, I want to see my comment history so that I can track my participation.
  - *Acceptance Criteria:*
    - Comments are listed chronologically with links to original posts.
- As a user, I want to see my engagement record so that I can measure my impact.
  - *Acceptance Criteria:*
    - Upvotes, quotes, and other metrics are summarized and accurate.

**Content Collections**
- As a user, I want to access all my created posts so that I can manage my content.
  - *Acceptance Criteria:*
    - All authored posts are listed and accessible.
- As a user, I want to see which post chats I have pinned so that I can quickly access important discussions.
  - *Acceptance Criteria:*
    - Pinned post chats are listed with quick links to open the chat.
- As a user, I want to see posts I have quoted or been quoted in so that I can track references.
  - *Acceptance Criteria:*
    - Quoted references are listed with context snippets and links.

---

### 6. Activity Feed

**Components & Features**

- **Interaction Score Panel**
  - **Visual Representation of User Engagement:** Displays a score or progress bar reflecting the user's activity (posts, comments, upvotes, etc.).
  - **Progress Indicators:** Shows progress toward the next level, badge, or achievement.
  - **Achievement Badges:** Earned badges are displayed, with tooltips explaining how they were earned.

- **Activity Stream**
  - **Chronological List of Activities:** Shows a real-time feed of actions by followed users (posts, comments, upvotes, follows).
  - **Categorized by Activity Type:** Users can filter the stream to show only certain types of activities (e.g., only new posts or only comments).
  - **Interactive Elements:** Users can react to activities (like, reply, follow) directly from the feed. Clicking an activity navigates to the relevant post or profile.

**User Stories**

**Interaction Score Panel**
- As a user, I want to see my engagement score so that I can track my activity on the platform.
  - *Acceptance Criteria:*
    - A score or progress bar is visible and updates with my activity.
- As a user, I want to see my progress toward achievements so that I am motivated to participate.
  - *Acceptance Criteria:*
    - Progress indicators and earned badges are displayed with explanations.

**Activity Stream**
- As a user, I want to see a real-time feed of activities from people I follow so that I can stay connected.
  - *Acceptance Criteria:*
    - The feed updates in real time with posts, comments, upvotes, and follows from followed users.
- As a user, I want to filter the activity stream by type so that I can focus on specific activities.
  - *Acceptance Criteria:*
    - Filters for activity type are available and functional.
- As a user, I want to interact with activities directly from the feed so that I can engage quickly.
  - *Acceptance Criteria:*
    - Like, reply, and follow actions are available and functional from the feed.
    - Clicking an activity navigates to the relevant post or profile.

## GraphQL API Documentation

The Quote Vote platform uses GraphQL for efficient data fetching and mutations.

---

### Input Types

**PostInput**
```graphql
input PostInput {
  content: String!
  subscoreboardId: ID!
  media: [Upload]      # Optional, for images/files
  title: String        # Optional, if posts have titles
  visibility: String   # "public", "private", or "restricted"
  allowComments: Boolean
  scheduledAt: DateTime
}
```

**CommentInput**
```graphql
input CommentInput {
  postId: ID!
  parentCommentId: ID   # Optional, for threaded replies
  content: String!
}
```

**QuotePostInput**
```graphql
input QuotePostInput {
  sourcePostId: ID!
  quotedText: String!
  quotingPostContent: String!
}
```

---

### Error Handling

- All errors are returned in the standard GraphQL `errors` array.
- Each error object contains:
  - `message`: Human-readable error message.
  - `code`: Application-specific error code (e.g., `UNAUTHORIZED`, `NOT_FOUND`, `VALIDATION_ERROR`).
  - `path`: The path in the query where the error occurred.
- Example error response:
  ```json
  {
    "errors": [
      {
        "message": "You must be logged in to perform this action.",
        "code": "UNAUTHORIZED",
        "path": ["createPost"]
      }
    ],
    "data": null
  }
  ```
- Validation errors (e.g., missing required fields) are returned with `code: "VALIDATION_ERROR"` and a descriptive message.

---

### Authentication and Authorization

- **Authentication** is handled via JWT (JSON Web Token) in the `Authorization` HTTP header:
  ```
  Authorization: Bearer <token>
  ```
- Users must be authenticated to perform mutations (create posts, comments, votes, etc.) and to access personalized queries (e.g., `feed`, `bookmarks`).
- **Authorization** is enforced at the resolver level:
  - Only the post author can edit or delete their post.
  - Only the comment author can edit or delete their comment.
  - Only authenticated users can upvote, downvote, bookmark, or follow.
  - Restricted posts/subscoreboards are only accessible to permitted users.
- If a user is not authorized, the API returns an error with `code: "FORBIDDEN"`.

---

### Pagination

- Pagination is implemented using the **Relay-style cursor-based** approach for all list queries (e.g., `feed`, `trending`, `comments`).
- Each paginated query accepts:
  - `first` (Int): Number of items to return after the cursor.
  - `after` (String): Cursor to start after.
  - (Optionally) `last` and `before` for reverse pagination.
- The response includes:
  - `edges`: Array of items, each with a `node` (the item) and a `cursor`.
  - `pageInfo`: Object with `hasNextPage`, `hasPreviousPage`, `startCursor`, `endCursor`.
- Example query:
  ```graphql
  query Feed($first: Int, $after: String) {
    feed(first: $first, after: $after) {
      edges {
        node {
          id
          content
          author { id username }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ```
- This approach ensures efficient loading of large lists and supports infinite scrolling in the UI.

---

### Core Queries

```graphql
# Get posts for feed (paginated)
query Feed($first: Int, $after: String) {
  feed(first: $first, after: $after) {
    edges {
      node {
        id
        content
        author { id username }
        upvotes
        downvotes
        comment_count
        created_at
        subscoreboard { id name }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

# Get trending posts (paginated)
query Trending($period: String!, $first: Int, $after: String) {
  trending(period: $period, first: $first, after: $after) {
    edges {
      node {
        id
        content
        upvotes
        downvotes
        comment_count
        author { id username }
        subscoreboard { id name }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

# Get post details (with paginated comments)
query Post($id: ID!, $commentsFirst: Int, $commentsAfter: String) {
  post(id: $id) {
    id
    content
    author { id username }
    upvotes
    downvotes
    comments(first: $commentsFirst, after: $commentsAfter) {
      edges {
        node {
          id
          content
          author { id username }
          created_at
          parent_comment_id
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    quotes {
      id
      quoted_text
      quoting_post_id
    }
    subscoreboard { id name }
    created_at
  }
}

# Get user profile
query UserProfile($id: ID!) {
  user(id: $id) {
    id
    username
    profile
    followers { id username }
    following { id username }
    posts { id content }
    bookmarks { id content }
  }
}
```

---

### Core Mutations

```graphql
# Create a post
mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    id
    content
    subscoreboard { id name }
    created_at
  }
}

# Upvote or downvote a post
mutation Vote($postId: ID!, $direction: String!) {
  vote(postId: $postId, direction: $direction) {
    id
    upvotes
    downvotes
  }
}

# Add a comment
mutation AddComment($input: CommentInput!) {
  addComment(input: $input) {
    id
    content
    author { id username }
    created_at
  }
}

# Quote a post
mutation QuotePost($input: QuotePostInput!) {
  quotePost(input: $input) {
    id
    quoted_text
    quoting_post_id
  }
}

# Bookmark a post (pins the post chat to the buddylist)
mutation Bookmark($postId: ID!) {
  bookmark(postId: $postId) {
    id
  }
}

# Follow a user
mutation Follow($userId: ID!) {
  follow(userId: $userId) {
    id
    following { id username }
  }
}
```

## Feature Development

  Testing of new React components is provided via Jest

    `npm run test`

## Contributing

1. Clone the repo, this pull our dev branch. it's our default branch  
  `git clone https://github.com/QuoteVote/quotevote-react.git`
2. Install node_modules  
`cd quotevote_react && npm i`
3. Check out a new branch, with `dev-` prefix  
  `git checkout -b dev-feature`  
  for example `dev-eslint-fix`
4. Do your work, check UI, run tests.
5. Make as many commits as you like. After each commit, push the branch back up to origin.
`git push origin dev-branchName`  
As a note, if it's incomplete, add `WIP` to the git commit message first line.  
For example
`WIP Linting files. Linted hssbComponent` 
Rest of git message
6. Once you are done with your work, make sure all test still pass, and that you have linted the files.  
  `npm run lint:check`  
  * Make the adjustments needed so there is no warnings or errors.
  * Ensure you can build without any problems.  
    `npm run build`
7. [Squash your commits](https://github.com/QuoteVote/quotevote-react/wiki/Squashing-Commits) so there is only one.
8. Create your pull request with a descriptive title.  
See the deployed version on the netlify preview build. Wait for code review, feedback, or approval.

  To see the preview build from Netlify, and scroll down to the bottom. Next to where it says "Deploy preview", it says Details. If it's still building, it'll direct you to the netlify log of the build process. Once complete it will show a green check like the example below.

  ![Netlify Deploy Preview](https://i.imgur.com/oPYdnvc.png)

*** 

<!-- ## File Structure -->
<!-- Work in Progress -->

### Additional Notes on Contributions

### React Hooks + GraphQL
- Use @apollo/react-hooks <!-- if you want to use hooks. -->
<!-- Use @apollo/react-components if you want to use components / render props -->
- If you want to make queries or mutation put them in the src/graphql/mutation.js  or src/graphql/query.js

### Use Our Wiki
Please use and contribute to the wiki: [Quote Vote-React Wiki](https://github.com/QuoteVote/quotevote-react/wiki)
