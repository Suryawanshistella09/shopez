# ShopEZ Frontend Documentation

## Overview
A modern, responsive e-commerce frontend built with React, featuring a clean UI design based on the provided mockups.

## Features Implemented

### 🎨 User Interface
- **Modern Design**: Clean, professional design with smooth animations and transitions
- **Fully Responsive**: Mobile-first approach, works seamlessly on all devices
- **Color Scheme**: Purple gradient theme (#5b5fd6) with complementary colors

### 📱 Pages Implemented

1. **Home Page** (`/`)
   - Hero banner with promotional content
   - Category cards (Fashion, Electronics, Mobiles, Groceries, Sports Equipment)
   - Responsive grid layout
   - Click-through to filtered product listings

2. **Products Page** (`/products`)
   - Product grid with filtering sidebar
   - Sort options: Popular, Price (low to high), Price (high to low), Discount
   - Category filters
   - Gender filters (Men, Women, Unisex)
   - Search functionality
   - Product cards with images, prices, and discount badges

3. **Register Page** (`/register`)
   - Username, email, password fields
   - User type selection (Admin/Customer)
   - Form validation
   - Link to login page

4. **Login Page** (`/login`)
   - Email and password fields
   - Form validation
   - Link to register page

5. **Cart Page** (`/cart`)
   - Cart items with product images and thumbnails
   - Product details (size, quantity, price)
   - Price breakdown sidebar
   - Remove item functionality
   - Place order button

6. **Orders/Profile Page** (`/orders`, `/profile`)
   - User profile sidebar with username, email, order count
   - Order history with product images
   - Order details (size, quantity, price, payment method, address)
   - Order status tracking
   - Cancel order functionality

### 🎯 Components

- **Navbar**: Sticky header with logo, search bar, user menu, cart icon with badge
- **CategoryCard**: Clickable cards for product categories
- **ProductCard**: Product display with image, name, description, pricing
- **HeroBanner**: Promotional banner section
- **Loader**: Loading spinner for async operations

### 🔒 Context Providers

- **AuthContext**: Handles user authentication (login, register, logout)
- **CartContext**: Manages shopping cart state (add, remove, update quantities)

### 🎨 Styling

All styles are modular and organized:
- `index.css` - Global styles and CSS variables
- `navbar.css` - Navigation bar styles
- `home.css` - Home page and category cards
- `products.css` - Product listing and filters
- `cart.css` - Shopping cart page
- `orders.css` - Orders and profile page
- `auth.css` - Login and register pages
- `loader.css` - Loading component

### 📦 Key Technologies

- **React 19** - UI library
- **React Router DOM** - Navigation
- **React Icons** - Icon library
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Vite** - Build tool

## Responsive Breakpoints

- Desktop: 1280px+ (full layout)
- Tablet: 768px - 1024px (adjusted layouts)
- Mobile: < 768px (stacked layouts, simplified navigation)

## Color Palette

```css
Primary: #5b5fd6 (Purple)
Primary Dark: #4a4db5
Primary Light: #7a7eef
Secondary: #f59e0b (Amber)
Success: #10b981 (Green)
Error: #ef4444 (Red)
Text Dark: #1f2937
Text Light: #6b7280
Background: #f9fafb
White: #ffffff
```

## API Integration

The frontend is configured to work with a backend API at `http://localhost:5000/api`

Endpoints integrated:
- `/auth/login` - User login
- `/auth/register` - User registration
- `/auth/profile` - Get user profile
- `/products` - Get all products
- `/products/:id` - Get single product
- `/orders` - Get user orders
- `/orders/:id` - Delete/cancel order

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Features Highlights

### User Experience
- Smooth page transitions
- Hover effects on interactive elements
- Loading states for async operations
- Toast notifications for user feedback
- Form validation
- Persistent cart (localStorage)
- Responsive images

### Performance
- Code splitting with React Router
- Lazy loading ready
- Optimized images
- Minimal re-renders with proper state management

### Accessibility
- Semantic HTML
- Proper heading hierarchy
- Form labels
- Alt text for images
- Keyboard navigation support

## Future Enhancements

Suggested additions:
- Product detail page
- Checkout flow
- Payment integration
- Order tracking
- Wishlist functionality
- Product reviews
- Admin dashboard
- Advanced filters (price range, ratings)
- Product search suggestions
- Order history export

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- All components are functional components using React Hooks
- State management through Context API
- Modular CSS for easy maintenance
- Mobile-first responsive design
- Clean code architecture

---

Built with ❤️ for ShopEZ E-commerce Platform
