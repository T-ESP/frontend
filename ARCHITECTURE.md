# Frontend Architecture

This document describes the reorganized Clean Architecture structure for the StockS frontend application.

## 🏗️ Architecture Overview

The project follows **Clean Architecture** principles with a clear separation of concerns across layers:

```
src/
├── domain/              # Enterprise Business Rules
├── application/         # Application Business Rules
├── infrastructure/      # External Interfaces & Frameworks
├── ui/                  # Presentation Layer
├── assets/              # Static Resources
└── lib/                 # Shared Utilities
```

---

## 📁 Folder Structure

### **domain/** - Domain Layer (Business Entities)
Contains the core business models and entities. These are the fundamental business objects of the application.

```
domain/
└── models/
    ├── User.ts
    ├── Product.ts
    ├── Order.ts
    ├── Supplier.ts
    └── Sales.ts
```

**Purpose**: Pure business logic, independent of frameworks or UI.

---

### **application/** - Application Layer (Use Cases)
Contains application-specific business rules. Use cases orchestrate the flow of data between entities and the outside world.

```
application/
└── usecases/
    ├── LoginUser/
    │   ├── LoginUser.ts
    │   └── LoginUser.types.ts
    └── RegisterUser/
        ├── RegisterUser.ts
        └── RegisterUser.types.ts
```

**Purpose**: Implements business logic and orchestrates domain entities.

---

### **infrastructure/** - Infrastructure Layer
Handles communication with external services, APIs, and data persistence.

```
infrastructure/
├── api/
│   ├── client.ts          # HTTP client configuration
│   ├── config.ts          # API configuration
│   └── services/          # API service implementations
│       ├── productService.ts
│       ├── orderService.ts
│       ├── userService.ts
│       ├── supplierService.ts
│       └── salesService.ts
└── http/
    ├── loginUserGateway.ts
    └── registerUserGateway.ts
```

**Purpose**: External interfaces, API clients, gateways.

---

### **ui/** - Presentation Layer (User Interface)
Everything related to the user interface, organized by feature.

```
ui/
├── components/          # Shared UI components
│   ├── common/         # Reusable components (Button, Input, etc.)
│   └── layouts/        # Layout components (AppLayout, AuthLayout, etc.)
├── features/           # Feature-based modules
│   ├── auth/          # Authentication feature
│   ├── dashboard/     # Dashboard feature
│   ├── inventory/     # Inventory management
│   ├── orders/        # Order management
│   ├── sales/         # Sales tracking
│   ├── suppliers/     # Supplier management
│   ├── team/          # Team/user management
│   ├── profile/       # User profile
│   └── ...           # Other features
├── hooks/             # Global custom hooks
├── pages/             # Standalone pages (NotFound, Playground)
├── routing/           # Route configuration
│   ├── routeConfig.tsx
│   ├── metaRoutes.ts
│   ├── pages.ts
│   └── ProtectedRoute.tsx
├── constants/         # UI constants
└── styles/            # Global styles
```

**Feature Module Structure:**

Each feature follows this structure:
```
features/[feature-name]/
├── pages/             # Feature pages
├── components/        # Feature-specific components
├── hooks/             # Feature-specific hooks
├── constants/         # Feature constants
├── types/             # Feature type definitions
└── utils/             # Feature utilities
```

**Example**: `features/inventory/`
```
inventory/
├── pages/
│   └── InventoryPage/
│       ├── InventoryPage.tsx
│       ├── InventoryTable/
│       ├── InventoryStats/
│       └── PageActions/
├── components/
│   ├── AddProductModal.tsx
│   ├── EditProductModal.tsx
│   └── DeleteConfirmModal.tsx
├── constants/
│   ├── data.ts
│   └── index.ts
└── types/
    ├── inventory.types.ts
    └── index.ts
```

---

### **assets/** - Static Resources
Contains all static resources like images, icons, and SVGs.

```
assets/
├── images/
│   └── logo/
└── svg/
```

---

### **lib/** - Shared Utilities
Generic utilities and helpers that are framework-agnostic.

```
lib/
└── productKPIs.ts
```

**Purpose**: Reusable utility functions with no business logic or framework dependencies.

---

## 🔄 Data Flow

1. **User Interaction** → UI Components (`ui/`)
2. **User Action** → Use Cases (`application/`)
3. **Business Logic** → Domain Models (`domain/`)
4. **External Data** → Infrastructure Services (`infrastructure/`)
5. **Response** → Back through the layers

---

## 📝 Import Path Convention

Use the `@/` alias for absolute imports from the `src/` directory:

```typescript
// ✅ Correct imports
import { User } from '@/domain/models/User';
import { LoginUser } from '@/application/usecases/LoginUser/LoginUser';
import { productService } from '@/infrastructure/api/services/productService';
import { Button } from '@/ui/components/common/Button';
import { useAuth } from '@/ui/features/auth/hooks/useAuth';
import PageLayout from '@/ui/components/layouts/PageLayout';

// ❌ Avoid relative imports across layers
import { User } from '../../../domain/models/User';
```

---

## 🎯 Design Principles

### 1. **Separation of Concerns**
Each layer has a single, well-defined responsibility.

### 2. **Dependency Rule**
Dependencies point inward. Outer layers depend on inner layers, never the reverse.
- **UI** depends on **Application** and **Domain**
- **Application** depends on **Domain**
- **Infrastructure** depends on **Application** and **Domain**
- **Domain** has no dependencies

### 3. **Feature-Based Organization**
UI features are self-contained modules with their own components, pages, hooks, and types.

### 4. **Reusability**
- Common UI components in `ui/components/common/`
- Shared utilities in `lib/`
- Feature-specific code stays within the feature

### 5. **Testability**
Clear boundaries make unit testing easier. Business logic in `application/` and `domain/` can be tested independently of UI.

---

## 🚀 Benefits

1. **Scalability**: Easy to add new features without affecting existing code
2. **Maintainability**: Clear structure makes it easy to locate and modify code
3. **Testability**: Business logic isolated from framework and UI concerns
4. **Team Collaboration**: Multiple developers can work on different features simultaneously
5. **Flexibility**: Easy to swap implementations (e.g., change API client, UI framework)

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `ui/routing/routeConfig.tsx` | Route configuration and layouts |
| `ui/routing/metaRoutes.ts` | Route metadata and definitions |
| `ui/routing/pages.ts` | Lazy-loaded page components |
| `ui/routing/ProtectedRoute.tsx` | Route protection logic |
| `App.tsx` | Main application component |
| `main.tsx` | Application entry point |

---

## 🔧 Development Guidelines

### Adding a New Feature

1. Create feature folder: `ui/features/[feature-name]/`
2. Add feature structure:
   ```
   [feature-name]/
   ├── pages/
   ├── components/
   ├── hooks/
   ├── constants/
   └── types/
   ```
3. Add page to `ui/routing/pages.ts`
4. Add route to `ui/routing/metaRoutes.ts`

### Adding a Use Case

1. Create folder: `application/usecases/[UseCaseName]/`
2. Add files:
   - `[UseCaseName].ts` - Implementation
   - `[UseCaseName].types.ts` - Type definitions
3. Import and use in UI layer

### Adding a Service

1. Create service: `infrastructure/api/services/[serviceName].ts`
2. Use the configured API client from `infrastructure/api/client.ts`
3. Call from use cases or components

---

## ✅ Migration Complete

All files have been reorganized according to Clean Architecture principles:
- ✅ Components moved to appropriate locations
- ✅ Feature-specific code grouped together
- ✅ All import paths updated
- ✅ Duplicate and empty folders removed
- ✅ No compilation errors

The codebase is now organized, maintainable, and ready for scaling.
