# Frontend Component Hierarchy

Complete component structure and interface definitions for the React frontend.

---

## Component Tree

```
App
├── Router
│   ├── PublicRoutes
│   │   ├── Login
│   │   └── Register
│   └── ProtectedRoutes
│       └── MainLayout
│           ├── Header
│           ├── Sidebar
│           ├── Routes
│           │   ├── Dashboard
│           │   ├── Transactions
│           │   ├── Analytics
│           │   ├── Cards
│           │   ├── Transfer
│           │   ├── Settings
│           │   └── Admin (role-based)
│           └── Footer
```

---

## 1. Common Components

### Button Component

**File:** `src/components/common/Button/Button.tsx`

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps>;
```

---

### Input Component

**File:** `src/components/common/Input/Input.tsx`

```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'search';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Input: React.FC<InputProps>;
```

---

### Card Component

**File:** `src/components/common/Card/Card.tsx`

```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps>;
```

---

### Modal Component

**File:** `src/components/common/Modal/Modal.tsx`

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps>;
```

---

### Table Component

**File:** `src/components/common/Table/Table.tsx`

```typescript
interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function Table<T>({ columns, data, loading, emptyMessage, onRowClick }: TableProps<T>);
```

---

### Spinner Component

**File:** `src/components/common/Spinner/Spinner.tsx`

```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fullScreen?: boolean;
}

export const Spinner: React.FC<SpinnerProps>;
```

---

## 2. Layout Components

### MainLayout Component

**File:** `src/components/layout/MainLayout/MainLayout.tsx`

```typescript
interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps>;
```

---

### Header Component

**File:** `src/components/layout/Header/Header.tsx`

```typescript
interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps>;
```

---

### Sidebar Component

**File:** `src/components/layout/Sidebar/Sidebar.tsx`

```typescript
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  roles?: UserRole[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  navItems: NavItem[];
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps>;
```

---

## 3. Authentication Components

### LoginForm Component

**File:** `src/components/auth/LoginForm/LoginForm.tsx`

```typescript
interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  loading?: boolean;
  error?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export const LoginForm: React.FC<LoginFormProps>;
```

---

### RegisterForm Component

**File:** `src/components/auth/RegisterForm/RegisterForm.tsx`

```typescript
interface RegisterFormProps {
  onSubmit: (data: RegisterData) => Promise<void>;
  loading?: boolean;
  error?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export const RegisterForm: React.FC<RegisterFormProps>;
```

---

### ProtectedRoute Component

**File:** `src/components/auth/ProtectedRoute/ProtectedRoute.tsx`

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps>;
```

---

## 4. Dashboard Components

### AccountSummary Component

**File:** `src/components/dashboard/AccountSummary/AccountSummary.tsx`

```typescript
interface Account {
  id: string;
  type: AccountType;
  balance: number;
  currency: string;
  accountNumber: string;
  status: AccountStatus;
}

interface AccountSummaryProps {
  accounts: Account[];
  totalBalance: number;
  loading?: boolean;
}

export const AccountSummary: React.FC<AccountSummaryProps>;
```

---

### QuickStats Component

**File:** `src/components/dashboard/QuickStats/QuickStats.tsx`

```typescript
interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

interface QuickStatsProps {
  stats: StatItem[];
  loading?: boolean;
}

export const QuickStats: React.FC<QuickStatsProps>;
```

---

### RecentTransactions Component

**File:** `src/components/dashboard/RecentTransactions/RecentTransactions.tsx`

```typescript
interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  merchant?: string;
  date: string;
  status: TransactionStatus;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  limit?: number;
  loading?: boolean;
  onViewAll: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps>;
```

---

### CardsList Component

**File:** `src/components/dashboard/CardsList/CardsList.tsx`

```typescript
interface CardData {
  id: string;
  cardNumberLast4: string;
  cardType: CardType;
  brand: CardBrand;
  expiryMonth: number;
  expiryYear: number;
  status: CardStatus;
}

interface CardsListProps {
  cards: CardData[];
  loading?: boolean;
  onCardClick: (card: CardData) => void;
}

export const CardsList: React.FC<CardsListProps>;
```

---

## 5. Transactions Components

### TransactionList Component

**File:** `src/components/transactions/TransactionList/TransactionList.tsx`

```typescript
interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  onTransactionClick: (transaction: Transaction) => void;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const TransactionList: React.FC<TransactionListProps>;
```

---

### TransactionFilters Component

**File:** `src/components/transactions/TransactionFilters/TransactionFilters.tsx`

```typescript
interface FilterOptions {
  startDate?: string;
  endDate?: string;
  category?: TransactionCategory;
  type?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

interface TransactionFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps>;
```

---

### TransactionDetail Component

**File:** `src/components/transactions/TransactionDetail/TransactionDetail.tsx`

```typescript
interface TransactionDetailProps {
  transaction: Transaction;
  onClose: () => void;
  onCategoryChange?: (transactionId: string, category: TransactionCategory) => void;
}

export const TransactionDetail: React.FC<TransactionDetailProps>;
```

---

## 6. Analytics Components

### SpendingChart Component

**File:** `src/components/analytics/SpendingChart/SpendingChart.tsx`

```typescript
interface SpendingData {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

interface SpendingChartProps {
  data: SpendingData[];
  chartType: 'bar' | 'pie' | 'line';
  loading?: boolean;
}

export const SpendingChart: React.FC<SpendingChartProps>;
```

---

### IncomeChart Component

**File:** `src/components/analytics/IncomeChart/IncomeChart.tsx`

```typescript
interface IncomeVsSpending {
  period: string;
  income: number;
  spending: number;
  savings: number;
}

interface IncomeChartProps {
  data: IncomeVsSpending[];
  period: TimePeriod;
  loading?: boolean;
}

type TimePeriod = 'WEEK' | 'MONTH' | 'YEAR';

export const IncomeChart: React.FC<IncomeChartProps>;
```

---

### CategoryChart Component

**File:** `src/components/analytics/CategoryChart/CategoryChart.tsx`

```typescript
interface CategoryData {
  name: string;
  value: number;
  color?: string;
}

interface CategoryChartProps {
  data: CategoryData[];
  type: 'donut' | 'bar';
  loading?: boolean;
}

export const CategoryChart: React.FC<CategoryChartProps>;
```

---

### PeriodSelector Component

**File:** `src/components/analytics/PeriodSelector/PeriodSelector.tsx`

```typescript
interface PeriodSelectorProps {
  selected: TimePeriod;
  onChange: (period: TimePeriod) => void;
  customDateRange?: boolean;
  onCustomDateChange?: (start: string, end: string) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps>;
```

---

## 7. Cards Components

### CardGrid Component

**File:** `src/components/cards/CardGrid/CardGrid.tsx`

```typescript
interface CardGridProps {
  cards: CardData[];
  loading?: boolean;
  onCardClick: (card: CardData) => void;
  onStatusToggle: (cardId: string, newStatus: CardStatus) => void;
}

export const CardGrid: React.FC<CardGridProps>;
```

---

### CardItem Component

**File:** `src/components/cards/CardItem/CardItem.tsx`

```typescript
interface CardItemProps {
  card: CardData;
  onClick: () => void;
  onStatusToggle: (newStatus: CardStatus) => void;
  showActions?: boolean;
}

export const CardItem: React.FC<CardItemProps>;
```

---

### CardDetail Component

**File:** `src/components/cards/CardDetail/CardDetail.tsx`

```typescript
interface CardDetailProps {
  card: CardData;
  transactions: Transaction[];
  onClose: () => void;
  onStatusToggle: (newStatus: CardStatus) => void;
}

export const CardDetail: React.FC<CardDetailProps>;
```

---

## 8. Transfer Components

### TransferForm Component

**File:** `src/components/transfer/TransferForm/TransferForm.tsx`

```typescript
interface TransferData {
  fromAccountId: string;
  toAccountId?: string;
  amount: number;
  description?: string;
  transferType: TransferType;
  recipientName?: string;
  recipientAccount?: string;
  recipientBank?: string;
  routingNumber?: string;
}

interface TransferFormProps {
  accounts: Account[];
  onSubmit: (data: TransferData) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export const TransferForm: React.FC<TransferFormProps>;
```

---

### TransferConfirmation Component

**File:** `src/components/transfer/TransferConfirmation/TransferConfirmation.tsx`

```typescript
interface TransferConfirmationProps {
  transfer: TransferData;
  fromAccount: Account;
  toAccount?: Account;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const TransferConfirmation: React.FC<TransferConfirmationProps>;
```

---

## 9. Settings Components

### ProfileSettings Component

**File:** `src/components/settings/ProfileSettings/ProfileSettings.tsx`

```typescript
interface ProfileData {
  name: string;
  email: string;
  phone?: string;
}

interface ProfileSettingsProps {
  user: User;
  onUpdate: (data: ProfileData) => Promise<void>;
  loading?: boolean;
}

export const ProfileSettings: React.FC<ProfileSettingsProps>;
```

---

### SecuritySettings Component

**File:** `src/components/settings/SecuritySettings/SecuritySettings.tsx`

```typescript
interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecuritySettingsProps {
  onPasswordChange: (data: PasswordChangeData) => Promise<void>;
  loading?: boolean;
}

export const SecuritySettings: React.FC<SecuritySettingsProps>;
```

---

### ThemeSettings Component

**File:** `src/components/settings/ThemeSettings/ThemeSettings.tsx`

```typescript
type Theme = 'light' | 'dark' | 'auto';

interface ThemeSettingsProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps>;
```

---

## 10. Admin Components (Optional)

### UserManagement Component

**File:** `src/components/admin/UserManagement/UserManagement.tsx`

```typescript
interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  accountCount: number;
  totalBalance: number;
  createdAt: string;
}

interface UserManagementProps {
  users: UserListItem[];
  loading?: boolean;
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  onUserClick: (user: UserListItem) => void;
  onDeactivate: (userId: string) => void;
}

export const UserManagement: React.FC<UserManagementProps>;
```

---

### SystemStats Component

**File:** `src/components/admin/SystemStats/SystemStats.tsx`

```typescript
interface SystemStatistics {
  totalUsers: number;
  activeUsers: number;
  totalAccounts: number;
  totalTransactions: number;
  totalTransferVolume: number;
  avgAccountBalance: number;
}

interface SystemStatsProps {
  stats: SystemStatistics;
  loading?: boolean;
}

export const SystemStats: React.FC<SystemStatsProps>;
```

---

## 11. Page Components

### Dashboard Page

**File:** `src/pages/Dashboard/Dashboard.tsx`

```typescript
export const Dashboard: React.FC = () => {
  // Combines: AccountSummary, QuickStats, RecentTransactions, CardsList
  // Fetches dashboard data from Redux store
  // Handles loading and error states
};
```

---

### Transactions Page

**File:** `src/pages/Transactions/Transactions.tsx`

```typescript
export const Transactions: React.FC = () => {
  // Combines: TransactionFilters, TransactionList, TransactionDetail (modal)
  // Manages filter state and pagination
  // Fetches transactions from API
};
```

---

### Analytics Page

**File:** `src/pages/Analytics/Analytics.tsx`

```typescript
export const Analytics: React.FC = () => {
  // Combines: PeriodSelector, SpendingChart, IncomeChart, CategoryChart
  // Manages time period selection
  // Fetches analytics data
};
```

---

### Cards Page

**File:** `src/pages/Cards/Cards.tsx`

```typescript
export const Cards: React.FC = () => {
  // Combines: CardGrid, CardDetail (modal)
  // Manages card operations (toggle status, request new)
};
```

---

### Transfer Page

**File:** `src/pages/Transfer/Transfer.tsx`

```typescript
export const Transfer: React.FC = () => {
  // Combines: TransferForm, TransferConfirmation (modal)
  // Multi-step transfer process
  // Validation and error handling
};
```

---

### Settings Page

**File:** `src/pages/Settings/Settings.tsx`

```typescript
export const Settings: React.FC = () => {
  // Combines: ProfileSettings, SecuritySettings, ThemeSettings
  // Tab-based layout for different setting categories
};
```

---

## 12. Custom Hooks

### useAuth Hook

**File:** `src/hooks/useAuth.ts`

```typescript
interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileData) => Promise<void>;
}

export const useAuth = (): UseAuthReturn;
```

---

### useTheme Hook

**File:** `src/hooks/useTheme.ts`

```typescript
interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useTheme = (): UseThemeReturn;
```

---

### useDebounce Hook

**File:** `src/hooks/useDebounce.ts`

```typescript
export function useDebounce<T>(value: T, delay: number): T;
```

---

### useLocalStorage Hook

**File:** `src/hooks/useLocalStorage.ts`

```typescript
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void];
```

---

## 13. Type Definitions

### User Types

**File:** `src/types/user.types.ts`

```typescript
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

### Account Types

**File:** `src/types/account.types.ts`

```typescript
export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CREDIT = 'CREDIT',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  FROZEN = 'FROZEN',
}

export interface Account {
  id: string;
  userId: string;
  type: AccountType;
  balance: number;
  currency: string;
  accountNumber: string;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}
```

---

### Transaction Types

**File:** `src/types/transaction.types.ts`

```typescript
export enum TransactionType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum TransactionCategory {
  GROCERIES = 'GROCERIES',
  DINING = 'DINING',
  SHOPPING = 'SHOPPING',
  ENTERTAINMENT = 'ENTERTAINMENT',
  TRANSPORTATION = 'TRANSPORTATION',
  UTILITIES = 'UTILITIES',
  HEALTHCARE = 'HEALTHCARE',
  EDUCATION = 'EDUCATION',
  TRAVEL = 'TRAVEL',
  TRANSFER = 'TRANSFER',
  SALARY = 'SALARY',
  INVESTMENT = 'INVESTMENT',
  OTHER = 'OTHER',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
}

export interface Transaction {
  id: string;
  accountId: string;
  cardId?: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  merchant?: string;
  merchantCategory?: string;
  date: string;
  status: TransactionStatus;
  balanceAfter: number;
  location?: string;
  metadata?: Record<string, any>;
}
```

---

### Card Types

**File:** `src/types/card.types.ts`

```typescript
export enum CardType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum CardBrand {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  AMEX = 'AMEX',
  DISCOVER = 'DISCOVER',
}

export enum CardStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  EXPIRED = 'EXPIRED',
}

export interface Card {
  id: string;
  accountId: string;
  cardNumber: string;
  cardNumberLast4: string;
  cardType: CardType;
  brand: CardBrand;
  expiryMonth: number;
  expiryYear: number;
  status: CardStatus;
  creditLimit?: number;
  availableCredit?: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## Component Development Checklist

For each component:

- [ ] Create component file with TypeScript interface
- [ ] Implement component logic
- [ ] Add Tailwind CSS styling
- [ ] Create test file (`*.test.tsx`)
- [ ] Write unit tests
- [ ] Add Storybook story (optional)
- [ ] Document props and usage
- [ ] Ensure accessibility (ARIA labels, keyboard navigation)
- [ ] Test responsive behavior
- [ ] Add error boundaries where needed

---

**Last Updated:** 2025-10-27
