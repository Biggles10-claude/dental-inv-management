# Dental Inventory Management System

## Build and Test Commands
- Install dependencies: `npm install`
- Run all tests: `npm test`
- Run tests in watch mode: `npm test -- --watch`
- Run a single test: `npm test -- -t "test name pattern"`
- Run tests with coverage: `npm test -- --coverage`
- Open application: Open `index.html` in browser or use a local server

## Code Style Guidelines
- **JavaScript**: ES6+ features, avoid global variables, use const/let appropriately
- **HTML/CSS**: Follow BEM naming convention for CSS classes (.block__element--modifier)
- **Formatting**: 4-space indentation, single quotes for strings, semicolons required
- **Naming Conventions**: camelCase for variables/functions, PascalCase for classes
- **Error Handling**: Use try/catch blocks with specific error messages
- **DOM Manipulation**: Use querySelector/All, avoid direct index access when possible
- **Functions**: Keep functions small (<30 lines), pure when possible, descriptive names
- **Variables**: Declare close to usage, descriptive names, avoid abbreviations
- **Comments**: Document complex logic, explain "why" not "what"

## Git Workflow
- **Commit Messages**: Use present tense, start with verb (Add, Fix, Update)
- **Branch Names**: Use kebab-case (feature-name, fix-issue)
- **Pull Requests**: Rebase feature branches on main before creating PRs
- **Squash commits**: Combine related commits before merging

## Project Structure
- **HTML**: Main page structure in index.html
- **CSS**: All styles in style.css
- **JavaScript**: Application logic in script.js
- **Tests**: Unit tests in __tests__ directory using Jest