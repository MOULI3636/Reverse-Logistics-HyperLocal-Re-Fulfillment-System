# Reverse Logistics - Smart HyperLocal Re-Fulfillment System

![Reverse Logistics Demo](https://img.shields.io/badge/Status-Active-brightgreen)

## 🌐 Live Demo
Try the deployed application here:

🔗 **Live Application:**  
https://reverselogistics-ayush.vercel.app/

## 📌 Overview
This platform intelligently manages customer returns by routing them to local warehouses instead of returning them all the way to the original source. When a new customer nearby orders the same product, it is quickly redispatched from the local warehouse, saving significant time, logistics costs, and reducing the carbon footprint.

## 🚀 Key Features
* **👤 Customer Portal**: Place orders, track deliveries, and easily request returns.
* **🏪 Seller Dashboard**: Approve or reject returns, track dispatched items, and review intelligent logistics routing maps comparing Source vs Local warehouse distances.
* **🛡️ Admin Warehouse Panel**: Inspect returned goods, repackage items, and manage local inventory pools for instant redispatch.
* **⚡ Interactive Demo Simulation**: A 12-step animated simulation demonstrating the entire lifecycle of an order, return, and redispatch.

## 🛠️ Technology Stack
* **Frontend**: React.js, Vite, Tailwind CSS, Lucide-React
* **Backend**: Node.js, Express.js, MongoDB, Mongoose
* **Tools**: Concurrently (for running both servers simultaneously)

---

## 💻 Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed on your locally or accessible via Atlas.

### Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/ayushh8557/reverse-logistics-demo.git
   cd reverse-logistics-demo
   ```

2. **Install all dependencies:**
   The root directory contains a `package.json` that will automatically install dependencies for both the frontend and backend.
   *(Note: You can also manually cd into `frontend/` and `backend/` and run `npm install` in each).*

3. **Start the Development Servers:**
   The project uses `concurrently` to run both the frontend and backend with a single command:
   ```bash
   npm run dev
   ```
   * The **Frontend (React)** will be available at: `http://localhost:5173`
   * The **Backend (API)** will be running at: `http://localhost:5000`

---

## 🎮 How to Test the Demo

To easily test out the functionality without registering new accounts, the database is pre-seeded with demo accounts. 

### 🔑 Demo Credentials
* **Customer**: `customer@gmail.com` / `customer@98765`
* **Seller**: `seller@gmail.com` / `seller@98765`
* **Admin**: `admin@gmail.com` / `admin@98765`

### 🔄 Testing the Workflow:
1. **Customer View:** Log in as the Customer to place a new order. Wait for the status to update to Delivered, and then formulate a **Return Request**.
2. **Seller View:** Log in as the Seller. You will see the incoming return requests. Review the **Map Routing** to visualize the distance saved by using a local warehouse. **Approve** the return.
3. **Admin View:** Log in as the Admin. Inspect the returned product, repackage it, and assign it to the **Local Inventory Pool**.
4. **Redispatch:** When a nearby customer orders the same item, the system will now prioritize dispatching from this new Local Inventory Pool instead of the far-away Source Warehouse!

*(Tip: You can also click "Interactive Demo" on the homepage navbar to watch an automated visual walkthrough of this exact process).*
