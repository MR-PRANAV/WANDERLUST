# 🏡 MAJOR-PRO Event & Property Booking Platform

> **A modern solution for property/event bookings, user management, and seamless payment workflows.**

---

## 🗂️ Project Overview

MAJOR-PRO is a full-featured platform for discovering, booking, and managing event venues or properties.  
✨ **User-friendly, secure, and built for real-world event needs.**

---

## 🚀 Features

- 🏠 **Property & Venue Listings:**  
  Browse detailed listings with images, pricing, capacity, and owner info.

- 📅 **Booking System:**  
  - Select dates, number of people, and instantly see price calculations (with GST).
  - Bookings are held for a limited time (e.g., 24 hours or 5 days) until payment.
  - Automatic cancellation if payment is not made in time.

- 🔒 **User Authentication:**  
  Secure login/signup, session management, and profile pages.

- 👤 **Profile Management:**  
  View your bookings, cancel or pay for pending bookings, and see booking status in real time.

- 💳 **Payment Workflow:**  
  - "Pay Now" button for pending bookings.
  - Booking status updates to "confirmed" after payment.
  - Expiry timer and auto-cancel for unpaid bookings.

- 🛠️ **Admin & Owner Controls:**  
  - Manage listings, view all bookings (including bookings made by others on your properties), and moderate users.

- 📱 **Responsive UI:**  
  Clean design using Bootstrap 5 and custom CSS.

---

## 🏗️ Project Structure

```
📁 controllers/
    ├─ user.js
    ├─ listing.js
    └─ booking.js
📁 models/
    ├─ user.js
    ├─ listing.js
    └─ booking.js
📁 routes/
    ├─ user.js
    ├─ listing.js
    └─ booking.js
📁 views/
    ├─ listings/
    ├─ bookings/
    └─ users/
📁 public/
    └─ css/
📁 uploads/
app.js
```

---

## 📝 Booking Flow

- **Search Listings:**  
  Filter by location, capacity, and more.

- **Book a Property:**  
  - Pre-filled forms if coming from a search.
  - Select check-in/check-out, number of people.
  - See price and GST instantly.

- **Booking Confirmation:**  
  - Booking is "pending" until payment.
  - Timer shows expiry; auto-cancels if not paid.
  - "Pay Now" and "Cancel" options in profile.

---

## 💡 User Experience

- 🏠 **Homepage:**  
  Browse listings, search/filter, and quick booking access.

- 👤 **Profile:**  
  See all your bookings, payment status, and manage/cancel as needed.

- 🛎️ **Booking Page:**  
  Pre-filled with search data, real-time validation, and price calculation.

- 🏢 **Owner/Admin Dashboard:**  
  Manage your own listings, see bookings made by others on your properties, and moderate users.

---

## ⚙️ Technologies Used

- Node.js, Express.js, MongoDB, Mongoose
- EJS templating
- Bootstrap 5, custom CSS
- Passport.js (authentication)
- Cloudinary (media uploads)
- Nodemailer (emails)

---

## 🔒 Security & Accessibility

- Passwords hashed, secure sessions, privacy policy
- Responsive design, accessible forms, and clear navigation

---

