# Contributing to Unio

Thank you for your interest in contributing to Unio! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [GitHub Issues](https://github.com/maoucodes/Unio/issues)
2. If not, create a new issue with:
   - A clear, descriptive title
   - Steps to reproduce the bug
   - Expected vs. actual behavior
   - Environment details (OS, Python version, Node version, etc.)
   - Any relevant error messages or logs

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with:
   - A clear description of the feature
   - Use cases and benefits
   - Any implementation ideas (optional)

### Pull Requests

1. **Fork the repository** and clone your fork
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following the code style guidelines below
4. **Test your changes** thoroughly
5. **Update documentation** if needed
6. **Commit your changes** with clear, descriptive commit messages
7. **Push to your fork** and create a Pull Request

## Development Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- Supabase account (for database)

### Backend Setup

```bash
cd app
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
# Edit .env with your Supabase credentials

# Run the server
uvicorn app:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install

# Copy environment template
cp .env.example .env.local
# Edit .env.local with your configuration

# Run the development server
npm run dev
```

## Code Style

### Python

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guidelines
- Use type hints where appropriate
- Maximum line length: 100 characters
- Use meaningful variable and function names
- Add docstrings for functions and classes

### TypeScript/React

- Follow the existing code style in the project
- Use TypeScript for type safety
- Use functional components with hooks
- Follow React best practices
- Use meaningful component and variable names

### Commit Messages

- Use clear, descriptive commit messages
- Start with a verb in imperative mood (e.g., "Add", "Fix", "Update")
- Keep the first line under 72 characters
- Add more details in the body if needed

Example:
```
Add support for new provider endpoint

- Implemented new provider client
- Added tests for the new provider
- Updated documentation
```

## Testing

### Backend Tests

```bash
python -m pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

- Write tests for new features
- Ensure all tests pass before submitting a PR
- Aim for good test coverage

## Documentation

- Update README.md if you add new features or change setup instructions
- Add docstrings to new functions and classes
- Update API documentation if you modify endpoints
- Keep code comments clear and concise

## Pull Request Process

1. Ensure your code follows the style guidelines
2. Make sure all tests pass
3. Update documentation as needed
4. Request review from maintainers
5. Address any feedback or requested changes
6. Once approved, your PR will be merged

## Questions?

If you have questions about contributing, feel free to:
- Open an issue with the `question` label
- Contact the maintainers via email: meet.sonawane2015@gmail.com

Thank you for contributing to Unio! 🎉
