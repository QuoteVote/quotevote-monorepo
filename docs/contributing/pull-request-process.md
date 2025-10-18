# Pull Request Process

We use Pull Requests (PRs) to review and merge code changes. Following this process ensures that all contributions are high-quality and align with the project's standards.

## 1. Fork and Clone the Repository

First, create a fork of the main repository to your own GitHub account. Then, clone your fork to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/quotevote-monorepo.git
cd quotevote-monorepo
```

## 2. Create a New Branch

Create a descriptive branch name for your changes. This helps isolate your work and makes the purpose of the PR clear.

```bash
# Example for a new feature
git checkout -b feat/add-dark-mode

# Example for a bug fix
git checkout -b fix/login-button-bug
```

## 3. Make Your Changes

Make your code changes, ensuring you follow the guidelines outlined in our [Code Style Guide](./code-style.md) and [Testing Guidelines](./testing.md).

### 🏷️ Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This helps create a clear and automated changelog.

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types:
- `feat`: New feature
- `fix`: Bug fix  
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic changes)
- `refactor`: Code refactoring (no feature changes)
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates

#### Scope Examples:
- `client`, `server`, `api`, `ui`, `auth`, `db`

#### Examples:
```bash
feat(auth): add password reset functionality

fix(client): resolve login button alignment issue  

docs(contributing): update PR process guidelines

test(api): add unit tests for user authentication
```

#### Guidelines:
- Use present tense ("add" not "added").
- Use imperative mood ("move cursor to..." not "moves cursor to...").
- Limit the first line to 72 characters.
- Reference issues in the footer: `Closes #123` or `Fixes #456`.

## 4. Push to Your Fork

Push your changes to your forked repository:

```bash
git push origin feat/add-dark-mode
```

## 5. Open a Pull Request

Navigate to the original Quote Vote repository on GitHub. You will see a prompt to create a Pull Request from your new branch. 

- Fill out the PR template with a clear description of your changes.
- Reference any issues that your PR resolves (e.g., `Closes #123`).
- Ensure all automated checks (like tests and linting) are passing.

## 6. The Review Process

- A maintainer will review your PR.
- You may be asked to make changes based on the feedback.
- Once approved and all checks pass, a maintainer will merge your PR.

Thank you for your contribution!

---

[< Back to Main Contributing Guide](../../CONTRIBUTING.md)
