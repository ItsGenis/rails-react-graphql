# RuboCop Configuration Guide

This guide covers the RuboCop configuration and how to use it effectively in your <%= appName %> Rails application.

## Overview

RuboCop is a Ruby static code analyzer and formatter that enforces the Ruby Style Guide. This project includes a comprehensive configuration that:

- Enforces modern Ruby and Rails best practices
- Includes performance optimizations
- Provides GraphQL-specific rules
- Integrates with RSpec testing
- Offers multiple output formats

## Configuration Files

- `.rubocop.yml` - Main configuration file
- `.rubocop_graphql.yml` - GraphQL-specific configuration
- `lib/tasks/rubocop.rake` - Rake tasks for running RuboCop

## Quick Start

### Run RuboCop
```bash
# Check entire codebase
bundle exec rubocop

# Auto-correct safe offenses
bundle exec rubocop -a

# Auto-correct all offenses (use with caution)
bundle exec rubocop -A
```

### Using Rake Tasks
```bash
# Run RuboCop check
rake rubocop

# Auto-correct safe offenses
rake rubocop:auto_correct

# Check specific files
rake rubocop:check_files[app/controllers]

# Generate TODO file for existing violations
rake rubocop:todo
```

## Configuration Details

### Main Rules

#### Layout
- **Line Length**: 120 characters (150 for GraphQL files)
- **Indentation**: 2 spaces
- **Array/Hash Alignment**: Fixed indentation style

#### Style
- **String Literals**: Single quotes preferred
- **Frozen String Literals**: Always enabled
- **Symbol Arrays**: Percent notation for 3+ items
- **Trailing Commas**: Required in multiline structures

#### Metrics
- **Method Length**: 20 lines (30 for GraphQL)
- **Class Length**: 150 lines
- **Complexity**: ABC size 30, Cyclomatic 10
- **Block Length**: Excluded for specs and config files

#### Rails
- **Action Filter**: Action style
- **Date/Time**: Strict timezone handling
- **Find Methods**: Arguments style
- **Validation**: Strict style

#### Performance
- All performance cops enabled
- Optimizes common Ruby patterns
- Suggests better alternatives

### GraphQL-Specific Rules

The `.rubocop_graphql.yml` file provides relaxed rules for GraphQL files:

- **Longer lines**: 150 characters
- **Complex methods**: Higher complexity limits
- **Nested classes**: Allowed for GraphQL types
- **Block length**: Excluded for field definitions

## Common Commands

### Basic Usage
```bash
# Check specific file
bundle exec rubocop app/controllers/application_controller.rb

# Check specific directory
bundle exec rubocop app/models/

# Check with specific format
bundle exec rubocop --format simple
bundle exec rubocop --format progress
bundle exec rubocop --format offenses
```

### Auto-correction
```bash
# Safe auto-corrections only
bundle exec rubocop -a

# All auto-corrections (may change behavior)
bundle exec rubocop -A

# Auto-correct specific files
bundle exec rubocop -a app/controllers/
```

### Reports
```bash
# Generate HTML report
bundle exec rubocop --format html --out rubocop.html

# Generate JSON report
bundle exec rubocop --format json --out rubocop.json

# Generate TODO file
bundle exec rubocop --auto-gen-config
```

## Integration

### Editor Integration

#### VS Code
Install the "Ruby" extension and add to settings.json:
```json
{
  "ruby.lint": {
    "rubocop": true
  },
  "ruby.format": "rubocop",
  "ruby.intellisense": "rubyLsp"
}
```

#### Vim/Neovim
Use ALE or coc.nvim with rubocop:
```vim
let g:ale_ruby_rubocop_executable = 'bundle'
let g:ale_ruby_rubocop_options = '--require rubocop-rails'
```

#### Sublime Text
Install "SublimeLinter-rubocop" package.

### Pre-commit Hooks

Add to `.git/hooks/pre-commit`:
```bash
#!/bin/sh
bundle exec rubocop --parallel
```

### CI/CD Integration

#### GitHub Actions
```yaml
name: RuboCop
on: [push, pull_request]
jobs:
  rubocop:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.2.0
          bundler-cache: true
      - run: bundle exec rubocop
```

#### GitLab CI
```yaml
rubocop:
  stage: test
  script:
    - bundle exec rubocop
  only:
    - merge_requests
```

## Best Practices

### Code Organization

1. **Group related cops** in configuration
2. **Use TODO files** for gradual adoption
3. **Customize rules** for your team's preferences
4. **Document exceptions** with inline comments

### Performance

1. **Run in parallel** for large codebases
2. **Exclude generated files** (db/, config/, etc.)
3. **Use specific file paths** when possible
4. **Cache results** in CI/CD

### Team Workflow

1. **Run before commits** (pre-commit hooks)
2. **Auto-correct safe offenses** regularly
3. **Review TODO files** periodically
4. **Update configuration** as team grows

## Troubleshooting

### Common Issues

#### "Command not found"
```bash
# Install RuboCop
bundle add rubocop --group development

# Install additional cops
bundle add rubocop-rails rubocop-rspec rubocop-performance
```

#### "Invalid configuration"
```bash
# Validate configuration
bundle exec rubocop --show-config

# Check specific rule
bundle exec rubocop --only Layout/LineLength
```

#### "Too many offenses"
```bash
# Generate TODO file
bundle exec rubocop --auto-gen-config

# Run with TODO file
bundle exec rubocop --config .rubocop_todo.yml
```

### Performance Issues

#### Slow execution
```bash
# Run in parallel
bundle exec rubocop --parallel

# Exclude large directories
# Add to .rubocop.yml Exclude section
```

#### Memory issues
```bash
# Limit parallel processes
bundle exec rubocop --parallel --max-parallel-jobs 4

# Process files individually
bundle exec rubocop app/controllers/
bundle exec rubocop app/models/
```

## Customization

### Adding Custom Rules

Create `.rubocop_local.yml` for team-specific rules:
```yaml
inherit_from: .rubocop.yml

# Team-specific customizations
Style/StringLiterals:
  EnforcedStyle: double_quotes

Metrics/MethodLength:
  Max: 25
```

### Disabling Rules

#### For entire file
```ruby
# rubocop:disable all
# Your code here
# rubocop:enable all
```

#### For specific rules
```ruby
# rubocop:disable Metrics/MethodLength
def long_method
  # method implementation
end
# rubocop:enable Metrics/MethodLength
```

#### For specific lines
```ruby
def method_with_long_line
  some_very_long_line_that_exceeds_the_limit # rubocop:disable Layout/LineLength
end
```

## Resources

- [RuboCop Documentation](https://docs.rubocop.org/)
- [Ruby Style Guide](https://rubystyle.guide/)
- [Rails Style Guide](https://rails.rubystyle.guide/)
- [RuboCop Rails](https://github.com/rubocop/rubocop-rails)
- [RuboCop RSpec](https://github.com/rubocop/rubocop-rspec)
- [RuboCop Performance](https://github.com/rubocop/rubocop-performance)
