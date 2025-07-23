# Virtual Tailor

A comprehensive web platform that connects customers with professional tailors for custom garment creation, featuring AI-powered 3D measurements, real-time communication, and integrated payment processing.

## 🌟 Features

### For Customers
- **AI-Powered 3D Measurements**: Interactive 3D body scanning and measurement capture
- **Tailor Discovery**: Browse and connect with verified professional tailors
- **Real-Time Communication**: Chat and video consultations with tailors
- **Order Management**: Track orders from creation to delivery
- **Style Customization**: Personalize garments with various options
- **Secure Payments**: Integrated escrow system for safe transactions

### For Tailors
- **Business Dashboard**: Comprehensive analytics and business insights
- **Order Queue Management**: Efficient workflow management tools
- **Customer Relationship Management**: Build and maintain client relationships
- **Portfolio Showcase**: Display work samples and specializations
- **Payout Management**: Track earnings and payment history

### For Administrators
- **System Monitoring**: Real-time health and performance metrics
- **User Management**: Comprehensive user administration tools
- **Analytics Dashboard**: Platform-wide insights and reporting
- **Quality Control**: Monitor service quality and user satisfaction
- **Payment Oversight**: Transaction monitoring and dispute resolution

## 🏗️ Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and building
- **State Management**: Zustand with persistence middleware
- **3D Graphics**: Three.js with React Three Fiber
- **Styling**: Tailwind CSS for responsive design
- **Real-time Communication**: Socket.io for live chat and updates
- **Data Fetching**: TanStack React Query
- **Form Handling**: React Hook Form
- **Routing**: React Router DOM v7
- **Notifications**: React Hot Toast
- **File Handling**: React Dropzone
- **Charts**: Recharts for data visualization

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   [git clone https://github.com/your-username/virtual-tailor.git](https://github.com/AdithaBuwaneka/virtual-tailor)
   cd virtual-tailor
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── admin/           # Admin-specific components
│   ├── ai/              # AI measurement components
│   ├── auth/            # Authentication components
│   ├── chat/            # Real-time chat system
│   ├── customer/        # Customer dashboard components
│   ├── layout/          # Layout and navigation
│   ├── measurement/     # 3D measurement system
│   ├── payment/         # Payment processing
│   ├── tailor/          # Tailor dashboard components
│   └── ui/              # Common UI elements
├── pages/               # Route-specific page components
│   ├── admin/           # Admin pages
│   ├── auth/            # Authentication pages
│   ├── customer/        # Customer pages
│   ├── shared/          # Shared pages
│   └── tailor/          # Tailor pages
├── store/               # Zustand state management
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Helper functions and utilities
├── data/                # Mock data for development
├── services/            # External service integrations
└── styles/              # Global styles and CSS
```

## 🔑 Authentication & User Roles

The application supports three user roles with different access levels:

### Demo Accounts
- **Admin**: `admin@virtualtailor.com` / `password`
- **Tailor**: `tailor@example.com` / `password`
- **Customer**: `customer@example.com` / `password`

### Role-Based Access
- **Customers**: Access to measurements, tailor browsing, orders, and chat
- **Tailors**: Business dashboard, order management, and customer communication
- **Admins**: System administration, analytics, and user management

## 🎨 Key Features Deep Dive

### 3D Measurement System
- Built with Three.js and React Three Fiber
- Interactive 3D human model for accurate measurements
- AI-powered measurement processing and validation
- Mobile-optimized interface with touch controls
- Real-time measurement feedback and guidance

### Real-Time Chat System
- Socket.io powered messaging
- File upload and sharing capabilities
- Video consultation integration
- Typing indicators and read receipts
- Conversation history and management

### Payment Processing
- Secure escrow system for transactions
- Multiple payment method support
- Automated invoice generation
- Refund and dispute management
- Transaction history and reporting

## 🛠️ Development

### Code Style
- ESLint configuration for code quality
- TypeScript for type safety
- Consistent component structure and naming
- Comprehensive error handling

### State Management
- Zustand stores for different feature areas
- Persistent storage for user sessions
- Optimistic updates for better UX
- Real-time synchronization with Socket.io

### Testing
```bash
npm run lint
# or
yarn lint
```

### Type Checking
```bash
npx tsc --noEmit
```

## 🌐 API Integration

The application is designed to work with a RESTful API and WebSocket connections:

- **REST API**: User authentication, order management, payment processing
- **WebSocket**: Real-time chat, notifications, live updates
- **File Upload**: Image and document handling for portfolios and orders

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Optimized 3D interface for touch devices
- Progressive Web App capabilities
- Cross-browser compatibility

## 🔒 Security Features

- Role-based access control
- JWT token authentication
- Secure file upload handling
- Input validation and sanitization
- HTTPS enforcement (in production)

## 🚧 Current Development Status

This project is currently in development mode with:
- Mock data for all API interactions
- Simulated authentication system
- Local state management
- Development-optimized 3D rendering

## 📋 Roadmap

- [ ] Backend API integration
- [ ] Real payment gateway integration
- [ ] Advanced AI measurement algorithms
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Three Fiber community for 3D web development
- Tailwind CSS for the design system
- Zustand for simple state management
- Socket.io for real-time capabilities

## 📞 Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

---

Made with ❤️ by the Virtual Tailor Team
