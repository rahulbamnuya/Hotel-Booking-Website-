# Dream Nest - Hotel Booking Website 🏨

A full-stack MERN application for hotel booking with authentication, image upload, and secure data storage.

---

## 🚀 Tech Stack
- **Frontend:** React, Tailwind CSS / Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT
- **File Uploads:** Cloudinary

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rahulbamnuya/Hotel-Booking-Website-
   cd Hotel-Booking-Website-
   ```
2. **Install dependencies**
   ```bash
   1. cd server
      npm install
   2. cd client 
      npm install
   ```
3. **Setup environment variables**
   Create a .env file in the server directory

   Copy values from .env.example and add your own credentials
   Sample:
   ```bash
   
   MONGO_URL=your_mongo_url
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   ```
4. **Run the project**
   ```bash
   Run backend
   cd server
   npm start

   Run frontend
   cd ../client
   npm start

   ```