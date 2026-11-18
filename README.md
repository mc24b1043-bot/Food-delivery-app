# Amber - Multi-Restaurant Food Ordering

Amber is a multi-restaurant food ordering website built with React, Express, and MongoDB. Customers can browse restaurants, explore each restaurant's menu, search dishes, and place orders. Admins can add restaurants and assign menu items to each one.

## Project credits

This project builds on the public [Food-Delivery repository by Mshandev](https://github.com/Mshandev/Food-Delivery), with additional customization and features.

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
- Restaurant browsing and restaurant-specific menus
- Vegetarian and non-vegetarian labels and menu filters
- Six demo restaurants with 56 starter dishes
- Add restaurants and menu items from the admin panel
- Search dishes across restaurants or inside a selected menu
- Sort menu items by price
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

The backend starts in local demo mode when `MONGO_URL` is not set. It seeds six restaurants and 56 dishes, then persists new accounts, restaurants, menu items, carts, and orders in `backend/data/demo-store.json`. Menu dishes include vegetarian and non-vegetarian labels and filters. No MongoDB service or Stripe key is needed for local browsing and testing; checkout uses a clearly marked demo flow. The first account registered in demo mode is the admin account.

For MongoDB mode or real Stripe test checkout, copy `backend/.env.example` to `backend/.env` and fill in your own values. Set `ADMIN_EMAIL` to the email that should have admin privileges. Seed the starter restaurants and 56 menu items with `npm.cmd --prefix backend run seed`. Never commit your `.env` file or real secret keys.

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

## Production deployment

The `Dockerfile` and `render.yaml` define a single-service Render deployment for the customer site, admin panel, and API. Production uses MongoDB and requires `MONGO_URL`, `JWT_SECRET`, and `ADMIN_EMAIL`; Stripe and a persistent uploads disk are optional. Follow Render's current plan and storage pricing before creating the service. Deploy this repository on Render after setting the required environment variables and reviewing the plan and storage costs.

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
