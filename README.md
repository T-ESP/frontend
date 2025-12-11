# StockS Frontend

Modern inventory management system built with React, TypeScript, and Vite following Clean Architecture principles.

## 🏗️ Architecture

This project follows **Clean Architecture** with clear separation of concerns:

```
src/
├── domain/              # Business entities and models
├── application/         # Use cases and business logic
├── infrastructure/      # API clients and external services
├── ui/                  # Presentation layer (components, pages, features)
├── assets/              # Static resources (images, SVGs)
└── lib/                 # Shared utilities
```

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

### Core Layers

- **domain/** - Pure business entities (User, Product, Order, etc.)
- **application/** - Use cases (LoginUser, RegisterUser)
- **infrastructure/** - API services and gateways
- **ui/** - All presentation layer code

### UI Organization

The `ui/` directory is organized by feature:

```
ui/
├── components/         # Shared components
│   ├── common/        # Reusable UI components
│   └── layouts/       # Layout components
├── features/          # Feature modules
│   ├── auth/         # Authentication
│   ├── dashboard/    # Dashboard & KPIs
│   ├── inventory/    # Inventory management
│   ├── orders/       # Order management
│   ├── sales/        # Sales tracking
│   └── ...          # Other features
├── hooks/            # Global custom hooks
├── pages/            # Standalone pages
├── routing/          # Route configuration
└── styles/           # Global styles
```

Each feature module contains:
- `pages/` - Feature pages
- `components/` - Feature-specific components
- `hooks/` - Feature-specific hooks
- `types/` - Type definitions
- `constants/` - Feature constants

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Icons** - Icon library

## 📦 Key Features

- ✅ Clean Architecture implementation
- ✅ Feature-based code organization
- ✅ Type-safe with TypeScript
- ✅ Protected routes & authentication
- ✅ Lazy-loaded pages for performance
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Toast notifications
- ✅ Error boundaries

## 🔧 Development

### Adding a New Feature

1. Create feature directory: `src/ui/features/[feature-name]/`
2. Add feature structure:
   ```
   [feature-name]/
   ├── pages/
   ├── components/
   ├── hooks/
   ├── types/
   └── constants/
   ```
3. Register page in `src/ui/routing/pages.ts`
4. Add route in `src/ui/routing/metaRoutes.ts`

### Import Conventions

Use absolute imports with the `@/` alias:

```typescript
// ✅ Correct
import { User } from '@/domain/models/User';
import { Button } from '@/ui/components/common/Button';
import { useAuth } from '@/ui/features/auth/hooks/useAuth';

// ❌ Avoid
import { User } from '../../../domain/models/User';
```

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture guide
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Migration history
- Feature READMEs in `src/ui/features/*/`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 ESLint Configuration

For production applications, enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

## 🤝 Contributing

1. Follow the established architecture patterns
2. Keep features self-contained
3. Use TypeScript for type safety
4. Write meaningful commit messages
5. Update documentation as needed

## 📄 License

[Your License]

---

**Built with** ❤️ **using Clean Architecture principles**
