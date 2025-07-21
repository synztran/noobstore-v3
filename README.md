# NoobStore - Mechanical Keyboard E-commerce Platform

🚀 A modern e-commerce platform built with Next.js, Tailwind CSS, and TypeScript, specializing in mechanical keyboards and accessories.

## 🌟 Features

### 🛍️ E-commerce Core

-   **Product Catalog**: Browse keyboards, switches, keycaps, desk mats, and accessories
-   **Shopping Cart**: Add, remove, and manage cart items with real-time updates
-   **Checkout System**: Complete order process with multiple payment methods
-   **Order Management**: Track orders and view order history
-   **User Authentication**: Secure login/register with role-based access

### 🎮 Interactive Features

-   **Lucky Wheel Game**: Spin-to-win promotional game with rewards
-   **Real-time Chat**: Live customer support with WebSocket integration
-   **Music Player**: Background music player for enhanced user experience
-   **Community Sharing**: Social features for keyboard enthusiasts

### 🎨 User Experience

-   **Responsive Design**: Mobile-first approach with Tailwind CSS
-   **Modern UI**: Clean, professional interface with Material-UI components
-   **Search & Filter**: Advanced product filtering and search capabilities
-   **Wishlist**: Save favorite products for later
-   **Product Reviews**: Customer feedback and ratings system

### 🔧 Technical Features

-   **TypeScript**: Full type safety and better development experience
-   **React Query**: Efficient data fetching and caching
-   **Zustand**: Lightweight state management
-   **WebSocket**: Real-time communication for chat and notifications
-   **SEO Optimized**: Next.js SEO features for better search visibility

## 🛠️ Tech Stack

### Frontend

-   **Next.js 14** - React framework with SSR/SSG
-   **TypeScript** - Type-safe JavaScript
-   **Tailwind CSS** - Utility-first CSS framework
-   **Material-UI** - React component library
-   **React Query** - Data fetching and caching
-   **Zustand** - State management
-   **Formik & Yup** - Form handling and validation

### Backend Integration

-   **RESTful APIs** - Custom API endpoints
-   **WebSocket** - Real-time communication
-   **Authentication** - JWT-based auth system
-   **File Upload** - Image and media handling

### Development Tools

-   **ESLint** - Code linting
-   **Prettier** - Code formatting
-   **Husky** - Git hooks
-   **TypeScript** - Static type checking

## 📦 Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd noobstore-web-ui
    ```

2. **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env.local
    # Configure your environment variables
    ```

4. **Run the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint
-   `npm run format` - Format code with Prettier
-   `npm run check-types` - TypeScript type checking
-   `npm run build-prod` - Build and export for static hosting

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── adminComponents/ # Admin dashboard components
│   ├── home/           # Homepage components
│   ├── luckyWheel/     # Lucky wheel game
│   ├── MessageChat/    # Real-time chat system
│   └── ...
├── pages/              # Next.js pages
│   ├── admin/          # Admin dashboard pages
│   ├── account/        # User account pages
│   ├── cart/           # Shopping cart
│   ├── checkout/       # Checkout process
│   └── ...
├── client/             # API client functions
├── context/            # React context providers
├── hook/               # Custom React hooks
├── interface/          # TypeScript interfaces
├── react-query/        # React Query configurations
├── services/           # External service integrations
├── utils/              # Utility functions
└── zustand/            # State management stores
```

## 🎯 Key Features Explained

### E-commerce Platform

-   **Product Management**: Complete CRUD operations for products
-   **Category System**: Organized product categorization
-   **Inventory Management**: Stock tracking and availability
-   **Pricing System**: Dynamic pricing with discounts and promotions

### User Management

-   **Authentication**: Secure login/register system
-   **User Profiles**: Personal information and preferences
-   **Order History**: Complete order tracking
-   **Address Management**: Multiple shipping addresses

### Admin Dashboard

-   **Analytics**: Sales and user analytics
-   **Order Management**: Process and track orders
-   **Product Management**: Add/edit products and categories
-   **User Management**: Manage customer accounts

### Interactive Features

-   **Lucky Wheel**: Gamification with rewards and prizes
-   **Live Chat**: Real-time customer support
-   **Community**: Social features for enthusiasts
-   **Music Player**: Background entertainment

## 🔒 Security Features

-   JWT-based authentication
-   Role-based access control
-   Secure API endpoints
-   Input validation and sanitization
-   CSRF protection

## 📱 Responsive Design

-   Mobile-first approach
-   Tablet and desktop optimized
-   Touch-friendly interfaces
-   Progressive Web App features

## 🚀 Deployment

### Netlify (Recommended)

```bash
npm run build-prod
# Deploy the 'out' directory to Netlify
```

### Vercel

```bash
npm run build
# Deploy to Vercel with automatic deployments
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   Built with ♥ by [HariHateDev](https://irah.vercel.app/)
-   Special thanks to the mechanical keyboard community
-   Icons and assets from various open-source contributors

---

**Support the project**: [Buy me a coffee](https://buymeacoffee.com/synztran) ☕

[![Have a nice day with a cup of coffee with me](https://cdn.buymeacoffee.com/buttons/default-red.png)](https://buymeacoffee.com/synztran)
