# Sunil's Kitchen - Food Ordering Website

Sunil's Kitchen is a food ordering website built with React, Express, and MongoDB. It includes dish search, price sorting, cart and order flows, and an admin panel for managing menu items and orders.

## Project credits

This project builds on the public [Food-Delivery repository by Mshandev](https://github.com/Mshandev/Food-Delivery), with additional customization and features by Sunil.

## Features added by Sunil

- Search dishes by name or description
- Sort the menu by price, low to high or high to low
- Clear a search quickly and show a helpful empty state
- Responsive contact section with email and phone links

## Demo

- User panel: run the frontend locally using the instructions below.
- Admin panel: run the admin app locally using the instructions below.

## Features

- User Panel
- Admin Panel
- JWT Authentication
- Password Hashing with Bcrypt
- Stripe Payment Integration
- Login/Signup
- Logout
- Add to Cart
- Place Order
- Order Management
- Products Management
- Filter Food Products
- Login/Signup
- Authenticated APIs
- REST APIs
- Role-Based Identification
- Beautiful Alerts

## Screenshots

![Hero](https://i.ibb.co/59cwY75/food-hero.png)
- Hero Section

![Products](https://i.ibb.co/JnNQPyQ/food-products.png)
- Products Section

![Cart](https://i.ibb.co/t2LrQ8p/food-cart.png)
- Cart Page

![Login](https://i.ibb.co/s6PgwkZ/food-login.png)
- Login Popup

## Run locally

Install Node.js, then install dependencies in each app folder:

```bash
cd frontend && npm install
cd ../admin && npm install
cd ../backend && npm install
```

Create `backend/.env`:

```bash
JWT_SECRET=YOUR_SECRET_TEXT
SALT=10
MONGO_URL=YOUR_MONGODB_CONNECTION_STRING
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
FRONTEND_URL=http://localhost:5173
```

If the frontend or admin should use a different API host, set `VITE_API_URL` in that app's `.env` file, for example `VITE_API_URL=http://localhost:4000`.

Start each part in a separate terminal from the project root:

```bash
cd backend
npm run server
```

```bash
cd frontend
npm run dev
```

```bash
cd admin
npm run dev
```

The backend runs on port `4000`. The frontend and admin currently point to the hosted backend. To use your local backend, change their API base URL to `http://localhost:4000` in `frontend/src/context/StoreContext.jsx`, `admin/src/App.jsx`, and `admin/src/assets/assets.js`. For local Stripe checkout, configure the frontend return URL in `backend/controllers/orderController.js` to match the frontend's local Vite URL.

## Tech Stack
* [React](https://reactjs.org/)
* [Node.js](https://nodejs.org/en)
* [Express.js](https://expressjs.com/)
* [Mongodb](https://www.mongodb.com/)
* [Stripe](https://stripe.com/)
* [JWT-Authentication](https://jwt.io/introduction)
* [Multer](https://www.npmjs.com/package/multer)

## Contact

- Sunil: [mc24b1043@iiitr.ac.in](mailto:mc24b1043@iiitr.ac.in)
- Phone: [+91 77374 64909](tel:+917737464909)
