# Contributing

## Workflow

We are using [Git Flow](https://datasift.github.io/gitflow/IntroducingGitFlow.html) to manage this branch.

Currently, we want to use Pivotal Tracker to break down each screen into components. Each epic will be a screen. Each story / task will be a component. Isolate each component in Storybook. Once completed and reviewed, integrate components slowly into the project to complete the epic.  

### Branch Naming convention

| Item                | Name                     |
| ------------------- | ------------------------ |
| Release branch      | release/v2.0.1           |
| Feature branch      | feature/my_feature-PT_ID |
| Chore branch        | chore/my_chore-PT_ID     |
| Hotfix branch       | hotfix/my_hotfix-PT_ID   |
| Commit              | See here                 |
| Tag                 | v2.0.1                   |
| Hotfix Tag          | v2.0.1.1                 |
| Work in progress PR | WIP My PR PT_ID          |
| Ready for review PR | RFR My PR PT_ID          |

- PT_ID is the Pivotal Tracker ID that can be found on the assigned story.
- If not assigned, ask one to be made or make one yourself: [Pivotal Tracker](https://www.pivotaltracker.com/n/projects/1579587)

## General Overview

Clone the repo:

`git clone https://github.com/scoreboardinc/voxpop-React`

Install dependencies:

`npm i`

Create a new branch:

`git checkout -b feature/my_branch-155477201`

Develop a new feature

- Make sure you always have the latest code before you start working:
  - `git pull`

Run unit tests, build the project, and test the UI after building

```
npm test
npm run build
serve -s build
```

Push your branch to Github, and create a Pull Request (PR)

```
git push origin feature/my_branch-155477201
```

Make a good PR message.

## Git

### Commit message

Every good commit should be able to complete the following sentence :
`When applied, this commit will: {{ YOUR COMMIT MESSAGE}}`

For Example:

```
– When applied this commit will Update README file
– When applied this commit will Add validation for GET /user/:id API call
– When applied this commit will Revert commit 12345
```

Here is a full git commit messages as an example. Note the indention, line length, description, use of verbs. (Add, Fix, Update, Change, Remove)

```
chore: Replace Formik with react-hook-form

  Replaces Formik with react-hook-form
  and theme-ui component to create custom styles

  Add
    - react-hook-form
    - shared/not-found component for 404s
    - form styles

  Change
    - renamed `app/form` to `app/auth`
      - moved `shared/auth-layout` to `app/auth`
    - replaced formik with react-hook-form in auth forms
```

### Basics

```bash
# Clone the repo from the remote
git clone <remote_repo>

# Refresh all branches from remote
git fetch --all --verbose --prune
git fetch -vap

# List branches
git branch -av

# List commits for the current branch (see below "git lg" for a better command line)
git log

# List commits for all branches (see below "git lgall" for a better command line)
git log --all --graph

# Switch to a branch
git checkout my_branch

# Get current branch changes from remote
git pull --rebase origin my_branch

# Choose the right branch
# Look the issue target version, or ask to your lead dev

# Create a new branch from the current branch
git checkout -b my_new_branch

# Create a new branch from another branch
git checkout -b my_new_branch the_old_branch

# Add added or updated files to the next commit
git add .
git add my/file

# Track and commit all updated files
git commit -a

# Commit after changes
# If the commit refers to an existing issue, put the issue #ID at the beginning of the message :
# git commit -am "$PT_IDAdd the git flow documentation"

# Commit new changes in the last commit, or change the last commit message
# git commit --amend -a
# git commit --amend -am "The new commit message"

# Send your branch to the remote
git push origin my_branch

# Squash X commits into a single one
git rebase -i HEAD~X
# You editor will open itself, then replace the words "pick" by "squash" on each line to squash, except the first one, save and quit.

# Squash commits into a single one, until (not including) COMMIT_ID
git rebase -i $COMMIT_ID
# You editor will open itself, then replace the words "pick" by "squash" on each line to squash, except the first one, save and quit.

# Delete a local branch
git branch -d my_branch

# Delete a remote branch
git push origin :my_branch

# ...
git help
```

#### gitconfig

You can add some git aliases and configure some options by editing your `.gitconfig` file :

[user]
name = yourName
email = yourName@gmail.com
[core]
excludesfile = /home/yourName/.gitignore
[push]
default = simple
[alias]
lg = log --abbrev-commit --decorate --date=relative --color --graph --pretty=tformat:'%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%an %ar)%Creset'
lgall = log --graph --abbrev-commit --decorate --date=relative --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)' --all
c = commit
co = checkout
st = status
f = fetch
br = branch
a = add
r = rebase
rere = rebase -i HEAD~2
rerere = rebase -i HEAD~3
[rerere]
enabled = true

With this `.gitconfig` file, you can add a `.gitignore` file in your home and add all your IDE hidden directories (.idea, .sublime, ...).

Examples of these aliases:

```bash
git co master # git checkout master
git rere # git rebase -i HEAD~2
git rerere # git rebase -i HEAD~3
git lg # git log
git lgall # git log --all
git a, git st, git br, ...
```

### How to GitFlow

#### I want to switch to a release branch

```bash
git checkout release/v2.0.1
```

#### I want to switch to a tag

```bash
git checkout v2.0.1
```

#### I want to work on an issue / feature

```bash
git checkout -b feature/my_feature_name-2234 release/v2.0.1
```

#### I want to get all new commit from a release branch in my feature branch

```bash
git checkout feature/my_feature_name-2234
git rebase release/v2.0.1
git push -f feature/my_feature_name-2234
# Or git rebase release/v2.0.1 feature/2234_my_feature_name
```

#### I want to merge my two last feature commits in a single commit to clean the history and make future merges easier

```bash
git rebase -i HEAD~2
git push origin feature/my_feature_name-2234 -f
```

#### I want to get only one commit from another branch in the current branch

```bash
git cherry-pick 28f0f05
```

#### I want to merge my feature with code review and PR

```bash
git checkout feature/2234
git rebase release/v2.0.1
git push -f origin feature/2234_my_feature_name
```

**Merge with Github**

Go to Github, then create a Pull Request from your feature branch in your forked project, to the target release branch in the parent project. Put a label at the beginning of the name : [WIP] or [RFR].
Wait for the _+1_ approval from another team member.

#### I want to create a new release branch

```bash
git checkout release/v2.0.1
git checkout -b release/v2.0.2
# Or git checkout -b release/v2.0.2 release/v2.0.1
```

#### I want to create a new tag

```bash
git checkout master
git tag -a v2.0.1 -m 'version 2.0.1'
git push origin v2.0.1
```

#### I want to delete an old release branch (a new one has been merged in master)

```bash
git branch -d release/v2.0.1
git push origin :release/v2.0.1
```

#### I want to do a hotfix

```bash
git checkout -b hotfix/fix_some_things release/v2.0.1
# Work & commit ...
git checkout release/v2.0.1
git merge hotfix/fix_some_things
git checkout master
git merge release/v2.0.1
git tag -a v2.0.1.1 -m 'version 2.0.1.1 - hotfix'
git branch -d hotfix/fix_some_things
# Merge the hotfix in working branches
git co release/v2.0.2
git merge release/v2.0.1
```
