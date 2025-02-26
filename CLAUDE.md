
# Dental Inventory Management System

## Build and Test Commands
- Install dependencies: `npm install`
- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Run a single test: `npx jest -t "test name"`
- Open application: Open `index.html` in browser

## Code Style Guidelines
- **JavaScript**: Use ES6+ features, avoid global variables
- **HTML/CSS**: Follow BEM naming convention for CSS classes
- **Naming Conventions**: camelCase for variables/functions, PascalCase for classes
- **Error Handling**: Use try/catch blocks with descriptive error messages
- **Documentation**: Comment complex logic, explain "why" not just "what"
- **Functions**: Keep functions small, focused, and pure when possible

## Git Workflow
- **Commit Messages**: Use present tense, start with verb (Add, Fix, Update)
- **Branch Names**: Use kebab-case (feature-name, fix-issue)
- **Pull Requests**: Rebase feature branches on main before creating PRs
- **Squash commits**: Combine related commits before merging

## Project Structure
- **HTML**: Main page structure in index.html
- **CSS**: All styles in style.css
- **JavaScript**: Application logic in script.js
- **Tests**: Unit tests in __tests__ directory
