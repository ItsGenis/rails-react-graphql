# Rails React GraphQL CLI

> **🤖 Built by AI**: This entire CLI tool was collaboratively developed with Claude (Anthropic's AI assistant). The project demonstrates the potential of AI-assisted software development, where human creativity and AI capabilities combine to build sophisticated developer tools.
>
> **⚠️ Use at Your Own Risk**: While extensively tested during development, this tool generates thousands of lines of code that haven't been individually reviewed by human eyes. Please review generated code before using in production environments.
>
> **📝 Meta Note**: Yes, even this README was written by the AI! Talk about eating your own dog food... or should I say, compiling your own documentation? 🤖✍️
>
> **📖 Read the journey**: [Blog post about building this CLI with AI](#) *(coming soon)*

A command-line tool to generate boilerplate Rails React GraphQL projects with modern tooling and best practices.

## 🚀 What Makes This Special

This isn't just another project generator. This CLI tool was **entirely built through human-AI collaboration**, showcasing:

- **🧠 AI-Driven Development**: Every line of code, from TypeScript CLI infrastructure to Docker configurations, was written with AI assistance
- **🔄 Iterative Problem Solving**: Real-time debugging, template processing fixes, and GraphQL configuration challenges solved collaboratively
- **📚 Comprehensive Documentation**: Auto-generated documentation and examples created during development
- **🎯 Production Ready**: Despite being AI-built, the output includes production-grade Rails APIs, Docker setups, and modern React applications

This project proves that AI can be a powerful pair-programming partner for complex software development tasks.

## 🚧 Current Status

**✅ COMPLETE: Rails Backend Generator (Task 2.0)**
- Full Rails API with GraphQL server
- Docker development environment
- Authentication system (JWT)
- Testing framework (RSpec)
- API documentation (Swagger)
- Code quality tools (RuboCop, Sorbet)

**🚧 IN PROGRESS: React Frontend Generator (Task 3.0)**
- React application with TypeScript *(coming soon)*
- Apollo Client for GraphQL *(coming soon)*
- Testing setup (Jest, React Testing Library) *(coming soon)*
- Build tools (Vite) *(coming soon)*

**📋 PLANNED: Additional Features (Tasks 4.0+)**
- GitHub Actions CI/CD pipeline
- Production deployment configurations
- Advanced Docker optimizations

> **Note**: Currently, running the CLI will generate a **fully functional Rails backend** but the React frontend is still in development. The generated project will include a `backend/` directory with everything needed to start building your Rails API!

## Features

- 🚀 **Quick Setup**: Generate a complete full-stack project in under 5 minutes
- 🔧 **Rails API**: Latest Rails version with API-only mode and GraphQL server
- ⚛️ **React Frontend**: Modern React with TypeScript and Apollo Client
- 🔗 **GraphQL Integration**: Complete GraphQL server and client setup
- 🐳 **Docker Support**: Multi-stage Docker builds for development and production
- 🧪 **Testing**: RSpec for Rails, Jest and React Testing Library for React
- 📝 **Linting**: RuboCop for Ruby, ESLint and Prettier for TypeScript
- 🔒 **Type Safety**: Sorbet for Ruby, TypeScript for React
- 📚 **Documentation**: API documentation setup with Swagger/OpenAPI

## Installation

### Global Installation (Recommended)

```bash
# Install globally using pnpm
pnpm add -g rails-react-graphql-cli

# Or using npm
npm install -g rails-react-graphql-cli

# Or using yarn
yarn global add rails-react-graphql-cli
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-repo/rails-react-graphql-cli.git
cd rails-react-graphql-cli

# Install dependencies
pnpm install

# Build the project
pnpm build

# Install globally for development
pnpm global:install
```

## Usage

### Interactive Mode

```bash
# Start interactive project generation
rails-react-graphql generate

# Generate with project name
rails-react-graphql generate my-app
```

### Non-Interactive Mode

```bash
# Generate with defaults
rails-react-graphql generate my-app --yes

# Custom configuration
rails-react-graphql generate my-app \
  --rails-version 7.1.0 \
  --react-version 18.2.0 \
  --database postgresql \
  --build-tool vite \
  --package-manager pnpm
```

### Command Options

```bash
rails-react-graphql generate [project-name] [options]

Options:
  -y, --yes                    Skip interactive prompts and use defaults
  --rails-version <version>    Rails version to use (default: 7.1.0)
  --react-version <version>    React version to use (default: 18.2.0)
  --database <type>            Database type: postgresql, sqlite (default: postgresql)
  --no-typescript              Disable TypeScript support
  --no-testing                 Disable testing setup
  --no-linting                 Disable linting and formatting
  --no-authentication          Disable authentication boilerplate
  --no-api-docs                Disable API documentation setup
  --no-git                     Skip Git repository initialization
  --no-docker                  Skip Docker configuration
  --build-tool <tool>          React build tool: vite, webpack (default: vite)
  --package-manager <manager>  Package manager: pnpm, npm, yarn (default: pnpm)
  -h, --help                   Show help information
```

### Rollback

```bash
# Rollback the last project generation
rails-react-graphql rollback

# Rollback specific project
rails-react-graphql rollback --project-path ./my-app
```

## Generated Project Structure

```
my-app/
├── backend/                 # Rails API application
│   ├── app/
│   │   ├── graphql/        # GraphQL schema and resolvers
│   │   ├── controllers/    # API controllers
│   │   └── models/         # ActiveRecord models
│   ├── config/
│   ├── db/                 # Database migrations
│   ├── spec/               # RSpec tests
│   └── Gemfile
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── graphql/        # GraphQL queries and mutations
│   │   └── types/          # TypeScript type definitions
│   ├── public/
│   ├── tests/              # Jest tests
│   └── package.json
├── docker-compose.yml      # Docker development environment
├── Dockerfile              # Multi-stage Docker build
├── .github/                # GitHub Actions CI/CD
└── README.md
```

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+
- Ruby 3.0+
- Rails 7.0+

### Development Commands

```bash
# Install dependencies
pnpm install

# Build TypeScript
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format

# Development mode with watch
pnpm dev
```

### Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test src/cli.test.ts

# Run tests with coverage
pnpm test --coverage

# Run tests in watch mode
pnpm test:watch
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/your-repo/rails-react-graphql-cli/wiki)
- 🐛 [Issue Tracker](https://github.com/your-repo/rails-react-graphql-cli/issues)
- 💬 [Discussions](https://github.com/your-repo/rails-react-graphql-cli/discussions)
