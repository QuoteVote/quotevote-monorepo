# GitHub PR Creation Script
# This script creates a URL-encoded PR and opens it in the browser

$title = (Get-Content "PR_TITLE.txt" -Raw).Trim()
$body = (Get-Content "PR_DESCRIPTION.txt" -Raw).Trim()

# URL encode the title and body
Add-Type -AssemblyName System.Web
$encodedTitle = [System.Web.HttpUtility]::UrlEncode($title)
$encodedBody = [System.Web.HttpUtility]::UrlEncode($body)

# Create the GitHub PR URL with query parameters
$prUrl = "https://github.com/QuoteVote/quotevote-monorepo/compare/main...Om7035:quotevote-monorepo:fix/issue-246-dynamic-og-metadata?expand=1&title=$encodedTitle&body=$encodedBody"

Write-Host "Opening GitHub PR creation page with pre-filled content..."
Write-Host "URL: $prUrl"

# Open in default browser
Start-Process $prUrl

Write-Host "`nPR creation page opened in your browser!"
Write-Host "Please review and click 'Create pull request' to submit."
