# Migration from DaisyUI to Mantine

This document summarizes the migration from DaisyUI to Mantine UI library.

## Changes Made

### 1. Dependencies

#### Removed:
- `daisyui` - Removed DaisyUI component library
- `tailwindcss` - Removed Tailwind CSS (Mantine uses its own styling system)
- `postcss` - No longer needed without Tailwind
- `autoprefixer` - No longer needed without Tailwind

#### Added:
- `@mantine/core@7` - Mantine core components
- `@mantine/hooks@7` - Mantine hooks for common React patterns
- `@emotion/react` - Required peer dependency for Mantine styling

### 2. Configuration Files

#### Deleted:
- `tailwind.config.js` - No longer needed
- `postcss.config.js` - No longer needed

#### Modified:
- `src/index.css` - Replaced Tailwind imports with Mantine styles:
  ```css
  @import "@mantine/core/styles.css";
  ```

### 3. Application Setup

#### `src/main.tsx`
- Added `MantineProvider` wrapper around the entire application
- This provider is required for Mantine components to work properly

### 4. Component Refactoring

All components were refactored to use Mantine components instead of DaisyUI classes:

#### `src/shared/components/ui/Button.tsx`
- Replaced custom button implementation with Mantine's `Button` component
- Updated variants to match Mantine's variant system:
  - `filled`, `light`, `outline`, `subtle`, `transparent`, `white`, `default`
- Simplified props to align with Mantine's API
- Added `onClick` prop for better type safety

#### `src/shared/components/ui/Card.tsx`
- Replaced custom card implementation with Mantine's `Paper` component
- Updated shadow props to match Mantine's shadow system
- Added `noPadding` prop to control padding
- Removed DaisyUI-specific props like `bordered`, `imageFull`, `glass`
- Added `onClick` prop for interactive cards

#### `src/shared/components/MenuCard.tsx`
- Refactored to use Mantine components: `Box`, `Title`, `Text`
- Replaced class-based styling with inline styles and Mantine props
- Updated color references to use Mantine's color system

#### `src/App.tsx`
- Replaced Tailwind classes with Mantine components:
  - `Container` for layout containment
  - `Box` for flexible containers
  - `Title` for headings
  - `Text` for text content
  - `SimpleGrid` for responsive grid layout
- Updated styling to use inline styles and Mantine props

#### `src/ErrorBoundary.tsx`
- Refactored to use Mantine components: `Box`, `Title`, `Text`, `Code`
- Replaced DaisyUI classes with Mantine styling
- Updated button variant from `primary` to `filled`

#### `src/features/score-flashcards/ScoreFlashcards.tsx`
- Replaced Tailwind/DaisyUI classes with Mantine components
- Used `Alert` component for info messages
- Updated layout with `Box` and `Container`

#### `src/features/name-flashcards/NameFlashcards.tsx`
- Refactored modal to use Mantine's `Modal` component
- Replaced button circles with `ActionIcon` for the info button
- Updated all styling to use Mantine components and inline styles
- Removed unused imports

#### `src/features/fingering-helper/FingeringHelper.tsx`
- Replaced button circles with `ActionIcon` for sharp/flat variations
- Updated layout with Mantine components: `Box`, `Container`, `Group`
- Converted class-based styling to inline styles

## Key Differences: DaisyUI vs Mantine

### Styling Approach
- **DaisyUI**: CSS classes with Tailwind utility classes
- **Mantine**: Component props with inline styles and sx prop support

### Component API
- **DaisyUI**: Relies on CSS classes (e.g., `btn`, `btn-primary`, `card`, `card-body`)
- **Mantine**: Props-based API (e.g., `variant="filled"`, `size="md"`, `color="blue"`)

### Theming
- **DaisyUI**: Theme switching via data attributes and CSS variables
- **Mantine**: Built-in theme provider with comprehensive theming system

### Button Variants
- **DaisyUI**: `primary`, `secondary`, `accent`, `ghost`, `link`, `info`, `success`, `warning`, `error`
- **Mantine**: `filled`, `light`, `outline`, `subtle`, `transparent`, `white`, `default`

### Colors
- **DaisyUI**: `text-primary`, `bg-base-100`, `text-error`
- **Mantine**: Color props and CSS variables (e.g., `c="blue.6"`, `var(--mantine-color-blue-6)`)

## Benefits of Migration

1. **Better TypeScript Support**: Mantine has excellent TypeScript support with comprehensive type definitions
2. **Smaller Bundle Size**: Removed Tailwind CSS reduces overall bundle size
3. **Consistent API**: All components follow similar prop patterns
4. **Built-in Features**: Mantine includes many built-in hooks and utilities
5. **Better Documentation**: Mantine has extensive documentation with interactive examples
6. **Active Development**: Mantine is actively maintained with regular updates

## Testing Checklist

- [x] TypeScript compilation passes
- [x] Production build succeeds
- [ ] All features work correctly in development mode
- [ ] All features work correctly in production build
- [ ] Responsive design works on mobile devices
- [ ] Accessibility features are maintained

## Next Steps

1. Test the application thoroughly in development mode: `npm run dev`
2. Consider implementing Mantine's dark mode support
3. Explore Mantine hooks like `useMediaQuery`, `useDisclosure`, etc.
4. Consider using Mantine's form library for future forms
5. Review and potentially simplify inline styles using Mantine's `sx` prop or style props