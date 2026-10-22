# UniShop

UniShop is a campus marketplace where students can list items, browse listings from verified student sellers, and contact sellers through real-time chat.

> The project is under active development. Marketplace, account verification, and chat flows are implemented. Some profile and admin pages are still placeholders; see [Current scope](#current-scope).

## Live links

- **Web app:** [uni-shop-jet.vercel.app](https://uni-shop-jet.vercel.app)
- **Repository:** [RTongit/UniShop](https://github.com/RTongit/UniShop)

## Features

### Accounts and student verification

- Student signup and login with bcrypt password hashing.
- JWT authentication stored in an HTTP-only `authCookie` cookie.
- New student accounts start with a `pending` verification status.
- Admins can review student details, approve accounts, or reject them with a reason.
- Server middleware checks the current user's role and verification status from MongoDB.
- Selling and chat APIs require a verified account.

### Marketplace

- Create listings with a title, category, description, price, pickup location, optional brand, and up to five photos from the listing form.
- Upload listing photos to Cloudinary.
- Search listing titles and categories; search results exclude the current user's listings, sold or deleted items, and items from unverified sellers.
- Sort search results by newest, oldest, or price.
- View item details and seller information.
- Manage your own listings: edit them, mark them sold, or soft-delete them.

### Chat and notifications

- Start or reopen a buyer-seller conversation tied to an item.
- Send text messages with optional image attachments.
- Deliver new messages and unread notifications with Socket.IO.
- Track unread status per chat and maintain a global unread-chat count for the navbar.
- Authenticate Socket.IO connections with the same cookie and check chat membership before joining a chat room.

### Admin verification

- Review student accounts in oldest-first order.
- Filter by pending, verified, rejected, or all students.
- Approve pending accounts or reject them with a required reason.
- The API only updates pending student accounts and returns a conflict if another admin has already reviewed the account.

## Current scope

The connected admin workflow is student verification. The admin dashboard, student management, and listing management pages currently contain placeholder content. The profile page and wishlist page are also placeholders; the heart button on an item currently changes only local page state and does not save a wishlist.

Student verification currently reviews the student details stored at signup. The user schema does not include a proof-document upload field.

There is no admin-provisioning route. For local development, grant the admin role to a trusted account directly in the database. Before production, add seller-ownership checks to the listing edit and delete handlers; they currently require a verified account and an existing item but do not confirm that the requester owns that item. The unread-count update also uses separate read and write operations, so concurrent messages can increment the global count more than once for the same chat; make that transition atomic before relying on the count under concurrent traffic.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | Next.js App Router, React, Tailwind CSS, Zustand |
| Backend | Node.js (ES modules), Express |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens, HTTP-only cookies, bcryptjs |
| Real-time | Socket.IO |
| Image storage | Cloudinary |
| UI utilities | lucide-react, Sonner |

## Repository structure

```text
UniShop/
├── backend/
│   ├── controllers/       # Authentication, listing, chat, and admin logic
│   ├── lib/               # MongoDB, JWT-cookie, and Cloudinary setup
│   ├── middleware/        # Authentication, verification, and admin checks
│   ├── models/            # User, item, chat, and message schemas
│   ├── routes/            # Express API routes
│   └── index.js           # Express and Socket.IO server
└── frontend/
    └── src/app/
        ├── (routes)/      # Marketplace, chat, account, and admin pages
        ├── components/    # Shared interface components
        └── store/         # Zustand auth, item, and chat stores
```

## Architecture

```text
Browser (Next.js / Zustand)
        │ REST API requests with authCookie
        ▼
Express API ─────────────── MongoDB (Mongoose models)
        │
        ├── Cloudinary (listing and message images)
        └── Socket.IO (chat messages and unread notifications)
```

## Run locally

### Prerequisites

- Node.js and npm.
- A MongoDB database, local or hosted.
- A Cloudinary account for listing and chat image uploads.

### 1. Configure the backend

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/unishop
SECRET_KEY=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

Use your MongoDB connection string if your database is hosted. Cloudinary credentials are needed for image uploads. Keep secrets out of source control.

In a terminal, install dependencies and start the API:

```bash
cd backend
npm install
npm run dev
```

The API listens on the port set by `PORT` (the example above uses `5000`).

To try the admin verification page locally, create a student account and grant its user record the `admin` role in MongoDB. The backend checks the current role from the database for admin API requests.

### 2. Configure the frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

In a second terminal, install dependencies and start Next.js:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The backend CORS and Socket.IO configuration allow the local frontend origin and the origin configured by `FRONTEND_URL`.

## Frontend pages

| Path | Purpose |
| --- | --- |
| `/` | Home page and category browsing entry point |
| `/signup`, `/login` | Student account creation and login |
| `/categories` | Browse marketplace categories |
| `/search?title=...` | Search and sort listings |
| `/item/[itemid]` | Item details and seller information |
| `/post` | Create an item listing (verified students) |
| `/my-listings` | View and manage your listings (verified students) |
| `/my-listings/edit/[itemId]` | Edit a listing (verified students) |
| `/chat`, `/chat/[chatId]` | Chat list and individual conversations (verified students) |
| `/admin/verification` | Admin student-verification queue |
| `/admin/dashboard`, `/admin/students`, `/admin/listings` | Admin placeholder pages |
| `/profile`, `/wishlist` | Placeholder pages |

Most marketplace pages require login. API middleware remains the authority for protected operations; client-side route checks are for navigation and user experience.

## Backend API

All endpoints are prefixed with `http://localhost:5000` in the local setup.

### Authentication

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signup` | Public | Create a pending student account |
| `POST` | `/api/auth/login` | Public | Sign in and set the auth cookie |
| `POST` | `/api/auth/logout` | Public | Clear the auth cookie |
| `GET` | `/api/auth/check` | Signed in | Return the current user's auth and verification details |

### Items

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/items/post` | Verified student | Create a listing and upload photos |
| `GET` | `/api/items/search?title=...` | Signed in | Search listings from verified sellers |
| `GET` | `/api/items/item/:id` | Public API | Get one non-deleted item's details and seller information |
| `GET` | `/api/items/myItems` | Verified student | Get the current user's active listings |
| `PATCH` | `/api/items/item/:id/edit` | Verified student | Edit a listing |
| `DELETE` | `/api/items/delete/:id` | Verified student | Soft-delete a listing |

### Chat

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/chat/` | Verified student | Create or retrieve a buyer-seller chat for an item |
| `GET` | `/api/chat/chats` | Verified student | Get the current user's chats |
| `POST` | `/api/chat/message` | Verified student | Send a message |
| `GET` | `/api/chat/:chatId/messages` | Verified student | Get messages for a chat the user belongs to |
| `GET` | `/api/chat/users/global-notification-status` | Signed in | Get the global unread-chat count |
| `PATCH` | `/api/chat/users/update-chat-notification-status/:chatId` | Verified student | Mark a chat as read and update the unread count |

### Admin

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/admin/verification-requests` | Admin | Get student accounts ordered oldest first |
| `PATCH` | `/api/admin/verification-requests/:studentId` | Admin | Approve or reject a pending student |

Admin verification updates accept `verificationStatus: "verified"` or `"rejected"`. Rejections require a non-empty `rejectionReason`.

## Socket.IO events

The client sends `JoinChat` and `LeaveChat` with a chat ID. The server verifies chat membership before allowing the socket into that chat room.

The server emits:

- `newMessage` to the chat room when a message is saved.
- `newChatNotification` to the recipient's user room when they are not currently in the chat.
- `newGlobalNotification` to update the recipient's global unread-chat count.

## Data model overview

- **User:** student/admin role, account and academic details, verification status and rejection reason, profile image, and global unread-chat count.
- **Item:** seller reference, title, category, optional brand, description, price, photo URLs, pickup location, sold flag, and soft-delete flag.
- **Chat:** buyer, seller, related item, and one unread-message flag for each participant.
- **Message:** chat, sender, receiver, text, optional image URL, and seen flag.

All four schemas use creation/update timestamps where configured.
