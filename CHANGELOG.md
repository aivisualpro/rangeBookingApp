# Changelog

All notable changes to Signal Dashboard are documented here.

## v2.1.0 — February 2026

### User Management

- Users list page with DataTable, role/status filters, and CRUD operations
- User detail page with profile card, permissions grid, and account details
- Create and edit user forms with React Hook Form + Zod validation
- 25 mock users with roles (admin, editor, viewer, moderator), permissions, and departments
- RBAC-style permissions model with granular permission strings

### Storybook

- Storybook 8.x with @storybook/react-vite framework
- 15 component stories across 3 tiers (core primitives, form components, dashboard widgets)
- Dark mode decorator and responsive viewport presets
- Auto-docs enabled for all stories

### Internationalization (i18n)

- Custom i18n system with React Context + localStorage persistence
- Type-safe translation keys with TypeScript NestedKeyOf utility
- 3 languages: English, German (Deutsch), French (Français)
- ~80 translation keys covering sidebar, header, dashboard, and common strings
- Locale switcher in Theme Customizer and Settings > Appearance tab

### Performance

- @next/bundle-analyzer integration with `npm run analyze` script
- next/dynamic lazy loading for chart components on dashboard home
- LazyChart wrapper using IntersectionObserver for viewport-triggered rendering
- Charts page uses LazyChart for deferred loading of below-fold charts

## v2.0.0 — February 2026

Major update covering Phases 2–9 of the product roadmap.

### Dashboard Variations

- eCommerce dashboard with sales charts, order status donut, top products
- CRM dashboard with pipeline funnel, deal stages, lead sources
- SaaS dashboard with MRR/ARR tracking, subscription plans, churn metrics

### App Pages

- Chat application with real-time messaging UI and conversation list
- Email/Inbox client with folders, compose dialog, and search
- File Manager with grid/list views, upload, and storage stats
- Kanban board with drag-and-drop task management
- Calendar with monthly view and event management
- Multi-step wizard form with validation
- User profile page with overview, activity, and connections tabs
- Pricing page with plan comparison

### Advanced Components

- TanStack Table upgrade with column filtering, sorting, pagination, CSV export, mobile responsive cards
- Date Picker, Date Range Picker
- Combobox/Autocomplete, Multi-Select, Phone Input
- File Uploader (react-dropzone), OTP Input, Color Picker
- Accordion, Alert, Carousel, Collapsible, Scroll Area, Slider, Toggle Group, Resizable

### Charts Showcase

- New `/charts` page with Radar, Radial Bar, Treemap, Scatter, and Composed charts
- 10 chart types total (Area, Bar, Line, Pie, Sparkline, Radar, RadialBar, Treemap, Scatter, Composed)

### Theme Customizer

- Live customizer drawer with color presets, density options
- 6 color presets: Default, Ocean, Sunset, Forest, Berry, Slate
- 3 density levels: Compact, Default, Comfortable
- Reset to defaults

### Layout Options

- Horizontal top-nav layout alternative
- Boxed container option (max-width centered)
- All layouts persist to localStorage

### RTL Support

- Full right-to-left text direction support
- CSS logical properties across all components
- Toggle in Theme Customizer

### Auth & Utility Pages

- Reset Password, Two-Factor Authentication, Email Verification, Lock Screen
- 500 Server Error, 403 Forbidden error pages
- Coming Soon and Maintenance pages

### Testing Infrastructure

- Vitest unit testing with jsdom environment (14 tests)
- Playwright E2E tests with Chromium (4 smoke tests)
- Representative test suites for utilities, data, and components

### Documentation

- Charts documentation page with all 10 chart types and usage patterns
- Testing documentation page with Vitest and Playwright guides
- Updated all existing docs pages to reflect v2.0.0 features

## v1.0.0 — February 2026

Initial release.

### Dashboard

- Overview page with stats cards, revenue chart (area/bar tabs), traffic pie chart, goals progress bars, recent orders table, and activity feed
- Analytics page with line and bar charts, time-period tabs (7d / 30d / 90d / 1y)
- Collapsible sidebar with icon-only mode and mobile overlay
- Header with command palette trigger, theme toggle, notifications dropdown, and user menu

### CRUD Pages

- **Orders** — List with status filter tabs, DataTable (search, sort, pagination), detail view, create form, edit form, delete confirmation
- **Products** — List with status + category filters, DataTable, detail view with pricing/inventory cards, create/edit forms, delete confirmation
- **Customers** — Read-only list with status filters, searchable DataTable with avatar initials

### Additional Pages

- **Billing** — Current plan card, payment method, usage meters (API calls, storage, team members), billing history table
- **Invoices** — DataTable with status tabs (All / Paid / Pending / Overdue), download actions
- **Notifications** — Tabbed view (All / Unread / Read), mark-as-read, mark-all-as-read, empty states
- **Settings** — Profile form, notification preferences (switches), appearance tab with theme selector
- **Support** — FAQ accordion, contact form

### Authentication

- Login page with email/password, social login buttons (Google, GitHub), remember me
- Register page with form validation (React Hook Form + Zod), terms checkbox
- Forgot Password page with email input

### Command Palette

- Cmd+K (Ctrl+K) fuzzy search via cmdk
- Pages, Actions (new order, toggle theme), and Quick Links groups
- Integrated with header search button

### Documentation Site (`/docs`)

- Dedicated layout with top nav and sidebar
- 10 pages: Introduction, Getting Started, Folder Structure, Theming, Adding Pages, Components, Charts, Testing, Deployment, Changelog

### UI Components

- 35+ vendored shadcn/ui components: Button, Card, Dialog, Table, Tabs, Badge, Input, Select, Textarea, Checkbox, Switch, Label, Radio Group, Form, Separator, Skeleton, Sheet, Tooltip, Popover, Breadcrumb, Dropdown Menu, Command, Avatar, Progress, Sonner (toast), Accordion, Alert, Carousel, Collapsible, Scroll Area, Slider, Toggle Group, Resizable, Calendar
- Shared components: DataTable, PageHeader, ConfirmDialog, EmptyState, DateRangePicker

### Theming

- Dark, light, and system modes with localStorage persistence
- OKLCh color tokens for perceptually uniform colors
- Semantic token system: primary, secondary, muted, accent, destructive, success, warning
- 5-color chart palette
- Dark sidebar variant in both light and dark modes

### Quality

- Loading skeletons for dashboard, orders, and products routes
- Error boundaries at dashboard and global levels
- Skip-to-content accessibility link
- ARIA attributes on navigation elements
- Zero ESLint errors and warnings
- Clean production build (119 routes)
