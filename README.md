# Amber - Food Ordering Website

Amber is a food ordering website built with React, Express, and MongoDB. It includes dish search, price sorting, cart and order flows, and an admin panel for managing menu items and orders.

## Project credits

This project builds on the public [Food-Delivery repository by Mshandev](https://github.com/Mshandev/Food-Delivery), with additional customization and features.

## Features

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

Install Node.js, open the project folder in VS Code, and install dependencies from the project root:

```powershell
npm.cmd --prefix frontend install
npm.cmd --prefix admin install
npm.cmd --prefix backend install
```

The backend starts in local demo mode when `MONGO_URL` is not set. It serves a sample menu, persists accounts/menu/cart/orders to `backend/data/demo-store.json`, and provides a demo checkout flow. No `.env` file, MongoDB service, or Stripe key is needed for local browsing and testing. The first account registered in demo mode is the admin account.

For MongoDB mode or real Stripe test checkout, copy `backend/.env.example` to `backend/.env` and fill in your own values. Set `ADMIN_EMAIL` to the email that should have admin privileges. Never commit your `.env` file or real secret keys.

Start each app in its own VS Code terminal from the project root:

```powershell
cd backend
npm.cmd run server
```

```powershell
cd frontend
npm.cmd run dev
```

```powershell
cd admin
npm.cmd run dev
```

Open the URLs printed by Vite in your browser. The frontend uses `http://127.0.0.1:5173`, the admin uses `http://127.0.0.1:5174`, and the backend health check is `http://127.0.0.1:4000`.

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
