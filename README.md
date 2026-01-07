# 👟 Shoe Store - Full Stack E-Commerce Application

A modern, full-featured shoe store application with separate admin and customer interfaces built with React and JSON Server.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Development Workflow](#development-workflow)
- [Database Schema](#database-schema)

---

## ✨ Features

### 👤 Customer Features
- ✅ Browse products by category
- ✅ View detailed product information with images
- ✅ Add products to favorites/wishlist
- ✅ Shopping cart management
- ✅ Secure checkout process
- ✅ Order tracking with status updates
- ✅ Write product reviews and ratings
- ✅ Manage multiple shipping addresses
- ✅ View order history
- ✅ Real-time notifications
- ✅ User profile management

### 🔐 Admin Features
- ✅ Complete product management (CRUD operations)
- ✅ Inventory management by size and color
- ✅ Stock level tracking with alerts
- ✅ Order management (accept/reject/update status)
- ✅ Customer management
- ✅ Purchase orders to suppliers
- ✅ Inventory log tracking
- ✅ Low stock notifications
- ✅ Dashboard with analytics
- ✅ Warehouse management

---

## 🛠 Tech Stack

### Frontend
- **React** - UI Library
- **React Router DOM** - Routing
- **Context API** - State Management
- **Axios** - HTTP Client
- **CSS Modules / Tailwind CSS** - Styling

### Backend
- **JSON Server** - Mock REST API
- **JSON Server Auth** - Authentication (optional)

---

## 📁 Project Structure

```
shoe-store-app/
├── public/
│   └── index.html
│
├── src/
│   ├── assets/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminNavbar.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── InventoryTable.jsx
│   │   │   ├── OrderTable.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   └── StockOrderForm.jsx
│   │   │
│   │   ├── customer/
│   │   │   ├── CustomerNavbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartItem.jsx
│   │   │   ├── ReviewForm.jsx
│   │   │   └── OrderCard.jsx
│   │   │
│   │   └── shared/
│   │       ├── Header.jsx
│   │       ├── Footer.jsx
│   │       ├── Loader.jsx
│   │       ├── Modal.jsx
│   │       └── Notification.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── NotificationContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   └── useFetch.js
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProductManagement.jsx
│   │   │   ├── InventoryManagement.jsx
│   │   │   ├── OrderManagement.jsx
│   │   │   └── StockOrders.jsx
│   │   │
│   │   ├── customer/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Favorites.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   └── shared/
│   │       ├── NotFound.jsx
│   │       └── Unauthorized.jsx
│   │
│   ├── routes/
│   │   ├── PrivateRoute.jsx
│   │   ├── AdminRoute.jsx
│   │   └── CustomerRoute.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   ├── inventoryService.js
│   │   └── cartService.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── admin.css
│   │   └── customer.css
│   │
│   ├── App.jsx
│   └── index.js
│
├── json-server-backend/
│   ├── db.json
│   └── routes.json (optional)
│
├── .gitignore
├── package.json
└── README.md
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Git**

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/shoe-store-app.git
cd shoe-store-app
```

### 2. Install Frontend Dependencies

```bash
npm install
# or
yarn install
```

### 3. Install JSON Server

```bash
npm install -g json-server
# or install locally
npm install json-server --save-dev
```

### 4. Setup Backend

```bash
cd json-server-backend
# db.json should already be present with all the schema
```

---

## 🎯 Running the Application

### Start JSON Server (Backend)

Open a terminal and run:

```bash
cd json-server-backend
json-server --watch db.json --port 3000
```

**JSON Server will run on:** `http://localhost:3000`

### Start React App (Frontend)

Open another terminal and run:

```bash
npm start
# or
yarn start
```

**React App will run on:** `http://localhost:3001`

### Access the Application

- **Customer Portal:** `http://localhost:3001`
- **Admin Portal:** `http://localhost:3001/admin`
- **API Server:** `http://localhost:3000`

---

## 🔑 User Roles

### Test Credentials

#### Admin Login
```
Email: admin@shoestore.com
Password: admin123
```

#### Customer Login
```
Email: john@example.com
Password: customer123

Email: jane@example.com
Password: customer123
```

---

## 📡 API Endpoints

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `POST /products` - Create product (Admin)
- `PUT /products/:id` - Update product (Admin)
- `PATCH /products/:id` - Partial update (Admin)
- `DELETE /products/:id` - Delete product (Admin)

### Categories
- `GET /categories` - Get all categories

### Authentication
- `GET /admins?email={email}&password={password}` - Admin login
- `GET /customers?email={email}&password={password}` - Customer login
- `POST /customers` - Register new customer

### Customer Operations
- `GET /customerFavorites?customerId={id}` - Get favorites
- `POST /customerFavorites` - Add to favorites
- `DELETE /customerFavorites/:id` - Remove from favorites
- `GET /customerCart?customerId={id}` - Get cart
- `POST /customerCart` - Add to cart
- `PUT /customerCart/:id` - Update cart
- `DELETE /customerCart/:id` - Clear cart
- `GET /customerOrders?customerId={id}` - Get customer orders
- `POST /customerOrders` - Place order
- `GET /customerReviews?productId={id}` - Get product reviews
- `POST /customerReviews` - Add review
- `GET /customerNotifications?customerId={id}` - Get notifications

### Admin Operations
- `GET /adminInventory` - Get all inventory
- `GET /adminInventory?productId={id}` - Get product inventory
- `POST /adminInventory` - Add inventory
- `PUT /adminInventory/:id` - Update stock
- `GET /adminInventoryLog` - Get inventory history
- `POST /adminInventoryLog` - Log inventory change
- `GET /adminStockOrders` - Get purchase orders
- `POST /adminStockOrders` - Create purchase order
- `PUT /adminStockOrders/:id` - Update PO status
- `GET /adminNotifications?adminId={id}` - Get admin notifications
- `GET /customerOrders` - Get all orders (Admin view)
- `PUT /customerOrders/:id` - Update order status

---

## 🔄 Development Workflow

### Phase 1: Setup & Basic Features (Week 1)
1. ✅ Setup React app and JSON Server
2. ✅ Create folder structure
3. ✅ Setup routing with React Router
4. ✅ Implement authentication (login/register)
5. ✅ Create AuthContext
6. ✅ Build basic layout components

### Phase 2: Customer Features (Week 2)
1. ✅ Product listing page with filters
2. ✅ Product detail page
3. ✅ Shopping cart functionality
4. ✅ Favorites/Wishlist
5. ✅ Checkout process
6. ✅ Order history

### Phase 3: Admin Features (Week 3)
1. ✅ Admin dashboard
2. ✅ Product management (CRUD)
3. ✅ Inventory management
4. ✅ Order management
5. ✅ Stock ordering system

### Phase 4: Advanced Features (Week 4)
1. ✅ Reviews and ratings
2. ✅ Notifications system
3. ✅ Search functionality
4. ✅ Filters and sorting
5. ✅ Responsive design
6. ✅ Form validations

### Phase 5: Polish & Deploy (Week 5)
1. ✅ Error handling
2. ✅ Loading states
3. ✅ Toast notifications
4. ✅ Performance optimization
5. ✅ Testing
6. ✅ Deployment

---

## 🗄️ Database Schema

### Main Collections

#### products
```json
{
  "id": 1,
  "name": "Classic Running Shoes",
  "brand": "Nike",
  "price": 89.99,
  "sizes": [8, 9, 10, 11, 12],
  "colors": ["Black", "White"],
  "category": "Running",
  "images": ["url1", "url2"],
  "description": "...",
  "features": ["..."],
  "isActive": true,
  "averageRating": 4.5,
  "totalReviews": 120
}
```

#### customers
```json
{
  "id": 1,
  "email": "john@example.com",
  "password": "customer123",
  "role": "customer",
  "firstName": "John",
  "lastName": "Doe",
  "addresses": [...]
}
```

#### adminInventory
```json
{
  "id": 1,
  "productId": 1,
  "size": 10,
  "color": "Black",
  "stock": 50,
  "reorderLevel": 5,
  "status": "in_stock",
  "warehouse": "Warehouse A"
}
```

#### customerOrders
```json
{
  "id": 1,
  "orderNumber": "ORD-2025-0001",
  "customerId": 1,
  "status": "pending",
  "items": [...],
  "total": 239.79,
  "shippingAddress": {...}
}
```

---

## 🎨 Styling Approach

### Option 1: CSS Modules
```jsx
import styles from './ProductCard.module.css';

<div className={styles.card}>...</div>
```

### Option 2: Tailwind CSS
```jsx
<div className="bg-white rounded-lg shadow-md p-4">...</div>
```

### Option 3: Styled Components
```jsx
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  border-radius: 8px;
`;
```

---

## 🔒 Security Considerations

- Store JWT tokens securely
- Validate all inputs on frontend and backend
- Use HTTPS in production
- Implement rate limiting
- Sanitize user inputs
- Use environment variables for sensitive data

---

## 📱 Responsive Design

- Mobile First Approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

---

## 📦 Build for Production

```bash
# Create production build
npm run build

# The build folder will contain optimized files
```

---

## 🚀 Deployment

### Deploy Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the build folder
```

### Deploy Backend (Render/Railway)
```bash
# JSON Server can be deployed as Node.js app
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- React Documentation
- JSON Server
- Ironhack Bootcamp

---

## 📞 Support

For support, email support@shoestore.com or join our Slack channel.

---

## 🐛 Known Issues

- [ ] Issue 1
- [ ] Issue 2

---

## 📝 Changelog

### Version 1.0.0 (2025-12-18)
- Initial release
- Basic customer and admin features
- Product catalog with inventory management
- Order processing system

---

**Happy Coding! 🚀**