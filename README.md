# 🛒 Mohan E-Shop - Full Stack E-commerce Application

A modern, full-stack e-commerce application built with **Spring Boot** (Backend) and **React** (Frontend), featuring JWT authentication, professional UI with animations, and a complete shopping experience.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![React](https://img.shields.io/badge/React-19.2-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with JWT tokens
- Secure password encryption using BCrypt
- Role-based access control (USER, ADMIN)
- Protected routes and endpoints
- Token-based session management

### 🛍️ E-commerce Functionality
- Product browsing and search
- Shopping cart management
- Order placement and tracking
- User profile management
- Admin product management

### 🎨 Modern UI/UX
- **Professional animations** with CSS keyframes
- **Glassmorphism effects** on cards
- **Gradient backgrounds** (purple for login, pink for register)
- **Responsive design** for mobile, tablet, and desktop
- **Smooth transitions** and micro-interactions
- **Loading states** and user feedback

### 🏗️ Advanced Data Structures
- **Recommendation System** using Heap
- **Product Search** with Trie
- **Recent Views** using Queue
- Optimized algorithms for better performance

## 🚀 Tech Stack

### Backend
- **Framework:** Spring Boot 3.x
- **Language:** Java 17
- **Database:** MySQL 8.0
- **Security:** Spring Security + JWT
- **Build Tool:** Maven
- **ORM:** JPA/Hibernate

### Frontend
- **Library:** React 19.2
- **Routing:** React Router DOM 7.11
- **Build Tool:** Vite 7.2
- **Styling:** Vanilla CSS with CSS Variables
- **Fonts:** Google Fonts (Inter)
- **HTTP Client:** Fetch API

## 📁 Project Structure

```
EcommerceJava/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/ecommerce/
│   │   ├── controller/              # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   ├── ProductController.java
│   │   │   ├── CartController.java
│   │   │   ├── OrderController.java
│   │   │   └── AdminProductController.java
│   │   ├── model/                   # Entity Models
│   │   │   ├── User.java
│   │   │   ├── Product.java
│   │   │   ├── Cart.java
│   │   │   └── Order.java
│   │   ├── repository/              # JPA Repositories
│   │   ├── service/                 # Business Logic
│   │   ├── security/                # Security Configuration
│   │   │   ├── SecurityConfig.java
│   │   │   ├── JwtUtil.java
│   │   │   └── JwtAuthenticationFilter.java
│   │   └── ds/                      # Data Structures
│   │       ├── RecommendationHeap.java
│   │       ├── ProductSearchTrie.java
│   │       └── RecentViewQueue.java
│   └── src/main/resources/
│       └── application.properties   # Configuration
├── frontend/                        # React Frontend
│   ├── src/
│   │   ├── pages/                  # Page Components
│   │   │   ├── Login.jsx
│   │   │   ├── Login.css
│   │   │   ├── Register.jsx
│   │   │   ├── Register.css
│   │   │   ├── Home.jsx
│   │   │   └── Home.css
│   │   ├── contexts/               # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── services/               # API Services
│   │   │   └── api.js
│   │   ├── index.css              # Global Styles
│   │   └── App.jsx                # Main App Component
│   └── package.json
└── database/                       # Database Scripts
    └── sample_data.sql
```

## 🔧 Installation & Setup

### Prerequisites
- Java 17 or higher
- Node.js 16+ and npm
- MySQL 8.0
- Maven 3.6+

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mohanraj111789/EcommerceJava.git
   cd EcommerceJava
   ```

2. **Configure MySQL Database**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE ecommerce_db;
   exit;
   ```

3. **Update database credentials**
   
   Edit `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. **Run the backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   
   Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   
   Frontend will start on `http://localhost:5173` or `http://localhost:5174`

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires JWT)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID

### Admin (Requires ADMIN role)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}/promote` - Promote user to admin

### Cart (Requires authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/remove/{id}` - Remove item from cart

### Orders (Requires authentication)
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders

## 🎨 Design System

### Color Palette
- **Primary:** #6366f1 (Indigo)
- **Secondary:** #ec4899 (Pink)
- **Success:** #10b981 (Green)
- **Error:** #ef4444 (Red)
- **Background:** #0f172a (Dark Blue)

### Animations
- **fadeIn** - Smooth opacity transition
- **slideUp** - Slide from bottom with fade
- **scaleIn** - Scale up with fade
- **shimmer** - Loading effect
- **pulse** - Breathing animation

### Typography
- **Font Family:** Inter (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700

## 🔒 Security Features

- **Password Encryption:** BCrypt hashing
- **JWT Authentication:** Secure token-based auth
- **CORS Configuration:** Controlled cross-origin requests
- **Role-Based Access:** USER and ADMIN roles
- **Protected Routes:** Frontend and backend route protection
- **Token Expiration:** 24-hour validity

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🧪 Testing

### Test User Registration
1. Navigate to `http://localhost:5173/register`
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
3. Click "Create Account"
4. You'll be redirected to the home page

### Test Login
1. Navigate to `http://localhost:5173/login`
2. Enter credentials
3. Click "Sign In"
4. You'll be redirected to the home page

## 🐛 Troubleshooting

### CORS Error
If you see CORS errors, ensure the backend `SecurityConfig.java` includes your frontend port:
```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173", 
    "http://localhost:5174"
));
```

### Database Connection Error
- Verify MySQL is running
- Check database credentials in `application.properties`
- Ensure database `ecommerce_db` exists

### Port Already in Use
- Backend: Change port in `application.properties`
- Frontend: Vite will automatically use next available port

## 📝 Environment Variables

### Backend (`application.properties`)
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### Frontend (Optional `.env`)
```env
VITE_API_URL=http://localhost:8080/api
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Mohanraj**
- GitHub: [@Mohanraj111789](https://github.com/Mohanraj111789)

## 🙏 Acknowledgments

- Spring Boot Documentation
- React Documentation
- Google Fonts (Inter)
- JWT.io for JWT implementation guidance

## 📸 Screenshots

### Login Page
Beautiful purple gradient with glassmorphism effects and smooth animations.

### Register Page
Pink gradient theme with staggered form animations.

### Home Page
Modern hero section with animated features grid and professional layout.

---

**Built with ❤️ using Spring Boot and React**
