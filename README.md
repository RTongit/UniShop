# UniShop

UniShop is a campus marketplace for students to list and discover second-hand items, message sellers, and coordinate a verified handoff. It includes student-account verification, live chat, and a reservation flow with an emailed one-time handoff code.

## Live project

- **Web app:** [uni-shop-jet.vercel.app](https://uni-shop-jet.vercel.app)
- **Repository:** [RTongit/UniShop](https://github.com/RTongit/UniShop)

## What it does

### Accounts and access

- Students sign up with academic and contact details. New accounts begin as `pending`.
- Passwords are hashed with bcryptjs. The API issues a JWT in an HTTP-only cookie.
- Protected API middleware loads the user's role and verification status from MongoDB.
- Pending or rejected students can sign in, but verified status is required for selling, messaging, and reservation APIs.
- Students can view their profile and change their profile photo. Other account details are read-only in the profile UI.

### Marketplace

- Create listings with title, category, description, price, pickup location, optional brand, and photos.
- Listing photos are stored in Cloudinary.
- Search titles and categories; results are sorted newest first and can be sorted in the UI.
- Search results exclude the signed-in user's own listings, deleted listings, non-available listings, and listings from sellers who are not verified students.
- Sellers can edit their own listings and soft-delete listings that are available or sold. Reserved listings cannot be manually changed to another status or deleted; listing details remain editable by the owner.
- Listing status is `available`, `reserved`, or `sold`.

### Chat and presence

- A buyer can start or reopen a conversation associated with a listing.
- Conversations support text and image messages. Message images are stored in Cloudinary.
- Messages are persisted in MongoDB and delivered through Socket.IO.
- Socket.IO authenticates the connection using the JWT cookie and checks chat membership before joining a chat room.
- Online presence is based on connected sockets. Per-chat unread flags and a global unread-chat count power the chat list and navbar indicator.
- Reservation and release notices are saved as chat messages; reservation release also updates the open chat's listing status in real time.

### Reservations and handoff

1. A verified buyer starts a chat for an available listing and requests a reservation.
2. The server atomically changes the listing from `available` to `reserved`, creates a purchase record, and stores a bcrypt hash of a randomly generated six-digit code.
3. The buyer receives the code by email. The seller receives a reservation notice in the existing chat.
4. The buyer can cancel the reservation, or the seller can release it and return the listing to `available`.
5. At the in-person handoff, the buyer shares the code with the seller. The seller enters it to mark the listing `sold` and the purchase `completed`.
6. If a code email fails, the reservation remains active. The buyer can request a replacement code; the new code replaces the stored hash. If the replacement email fails, the controller attempts to restore the prior hash.

The purchase record stores the item, buyer, seller, pickup-location snapshot, status, verification-code hash, expiry timestamp, and completion timestamp. It does not store the readable code.

### Admin student verification

- Admins can review student accounts in oldest-first order and filter by pending, verified, rejected, or all.
- Admins can approve a pending student or reject them with a required reason.
- The API accepts only `verified` or `rejected`, applies changes only to pending student accounts, and returns a conflict if the request was already reviewed.
- Verification reviews the student's submitted account details; proof-document upload is not part of the current schema or flow.

## Current limitations and follow-up work

- `expiresAt` is saved as 24 hours after reservation, but there is no scheduled worker to expire reservations automatically or reopen their listings. Sellers can release a reservation manually. The `expired` purchase status is defined but not automatically applied.
- Reservation-code resend has no cooldown or rate limit yet. A TODO for a resend cooldown is recorded in the purchase model.
- Email uses Resend's `onboarding@resend.dev` sender. Resend testing mode is limited to the account's verified recipient; sending to real buyers requires a verified sending domain and an updated sender address.
- The admin dashboard, admin student-management page, and admin listing-management page are placeholders. The connected admin feature is student verification.
- The wishlist page is a placeholder; wishlist actions are not persisted.
- There is no admin-provisioning API. For local development, assign the admin role directly to a trusted account in MongoDB.
- The chat message controller updates the per-chat unread flag and global unread count in separate writes. Concurrent messages can race; harden this transition before relying on exact counts under heavy concurrent traffic.
- `undoReserve` uses a MongoDB transaction. Use MongoDB Atlas or a local replica set for that operation; a standalone MongoDB server does not support multi-document transactions.
- Marking an item sold updates the listing and purchase in separate operations with compensating rollback. It is not implemented as a multi-document transaction.

## Technology

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js App Router 16, React 19, Tailwind CSS 4, Zustand |
| Backend | Node.js ES modules, Express 5 |
| Database | MongoDB, Mongoose 9 |
| Authentication | JWT, HTTP-only cookies, bcryptjs |
| Real-time | Socket.IO 4 (server and client) |
| Media | Cloudinary |
| Transaction email | Resend |
| UI | lucide-react, Sonner |

## Repository layout

```text
UniShop/
├── backend/
│   ├── controllers/       # Auth, admin verification, listings, reservations, and chat
│   ├── lib/               # MongoDB, JWT cookie, Cloudinary, and Resend setup
│   ├── middleware/        # Authentication, verified-student, and admin guards
│   ├── models/            # User, item, chat, message, and purchase schemas
│   ├── routes/            # Express API routes
│   └── index.js           # Express and authenticated Socket.IO server
└── frontend/
    └── src/app/
        ├── (routes)/      # Marketplace, account, chat, and admin pages
        ├── components/    # Shared UI and chat/reservation components
        └── store/         # Zustand auth, item, and chat stores
```

## Run locally

### Requirements

- Node.js and npm
- MongoDB Atlas, or local MongoDB configured as a replica set for reservation cancellation transactions
- Cloudinary credentials for listing and chat image uploads
- Resend API key for reservation-code email. A verified sending domain is required for sending to recipients outside Resend's testing restrictions.

### Backend

Create `backend/.env` (do not commit it):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/unishop
SECRET_KEY=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
RESEND_API_KEY=your-resend-api-key
```

For MongoDB Atlas, replace `MONGODB_URI` with the Atlas connection string. In `backend/`:

```bash
npm install
npm run dev
```

The API listens on `PORT` (5000 in the example). `npm start` starts the production server.

### Frontend

Create `frontend/.env.local` (do not commit it):

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

In `frontend/`:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend package also provides `npm run build`, `npm start`, and `npm run lint`.

The backend CORS and Socket.IO CORS settings allow `http://localhost:3000` and the configured `FRONTEND_URL`. For local admin verification, create a student account and change its `role` to `admin` in the database.

## Frontend routes

| Route | Purpose / access |
| --- | --- |
| `/` | Marketplace landing page and category browsing; signed-in users |
| `/signup`, `/login` | Student registration and sign-in |
| `/categories` | Category browser |
| `/search?title=...` | Search available listings; signed-in users |
| `/item/[itemid]` | Listing details and seller information |
| `/post` | Create a listing; verified students |
| `/my-listings` | Manage own listings, release reservations, and mark reserved items sold; verified students |
| `/my-listings/edit/[itemId]` | Edit an owned listing; verified students |
| `/chat`, `/chat/[chatId]` | Chat list and listing-specific conversation; verified students |
| `/profile` | View account details and update profile photo |
| `/admin/verification` | Review student verification requests; admins |
| `/admin/dashboard`, `/admin/students`, `/admin/listings` | Placeholder admin pages |
| `/wishlist` | Placeholder page |

Client-side route checks support navigation and user experience. The backend middleware enforces authorization for protected APIs.

## Backend API

Local API base URL: `http://localhost:5000`. Protected routes use the `authCookie` cookie.

### Authentication and profile

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signup` | Public | Create a pending student account and sign in |
| `POST` | `/api/auth/login` | Public | Sign in |
| `POST` | `/api/auth/logout` | Public | Clear the auth cookie |
| `GET` | `/api/auth/check` | Signed in | Return current identity and verification status |
| `GET` | `/api/auth/profile` | Signed in | Get the current user's profile |
| `PATCH` | `/api/auth/profile` | Signed in | Upload/update the profile photo |

### Listings and reservations

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/items/post` | Verified student | Create a listing and upload photos |
| `GET` | `/api/items/search?title=...` | Signed in | Search available listings from verified sellers |
| `GET` | `/api/items/item/:id` | Public API | Get listing details and seller information |
| `GET` | `/api/items/myItems` | Verified student | Get own non-deleted listings |
| `PATCH` | `/api/items/item/:id/edit` | Verified student, owner | Edit an owned listing |
| `DELETE` | `/api/items/delete/:id` | Verified student, owner | Soft-delete an available or sold listing |
| `POST` | `/api/items/reserve/:id` | Verified student, buyer | Atomically reserve an available listing and send the handoff code |
| `POST` | `/api/items/resend-reservation-code/:itemId` | Verified student, reservation buyer | Rotate the code hash and email a replacement code |
| `PATCH` | `/api/items/undoReserve/:id` | Verified student, reservation buyer | Cancel the buyer's reservation and reopen the listing |
| `PATCH` | `/api/items/release-reservation/:id` | Verified student, listing seller | Release a reservation and reopen the listing |
| `PATCH` | `/api/items/:itemId/mark-sold` | Verified student, listing seller | Verify the handoff code and complete the sale |

### Chat and notifications

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/chat/` | Verified student | Create or retrieve a buyer/seller chat for a listing |
| `GET` | `/api/chat/chats` | Verified student | Get the current user's chats |
| `POST` | `/api/chat/message` | Verified student, chat member | Send a text or image message |
| `GET` | `/api/chat/:chatId/messages` | Verified student, chat member | Load chat history |
| `GET` | `/api/chat/users/global-notification-status` | Signed in | Get the global unread-chat count |
| `PATCH` | `/api/chat/users/update-chat-notification-status/:chatId` | Verified student, chat member | Mark the chat read and decrement its unread count |

### Admin verification

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/admin/verification-requests` | Admin | List student verification records oldest first |
| `PATCH` | `/api/admin/verification-requests/:studentId` | Admin | Approve or reject a pending student |

For rejection, send `verificationStatus: "rejected"` and a non-empty `rejectionReason`. Approval uses `verificationStatus: "verified"`.

## Socket.IO events

The client emits `JoinChat` and `LeaveChat`. The server checks chat membership before adding a socket to a private chat room.

The server emits:

- `onlineUsers` with the connected user IDs.
- `newMessage` to a chat room after a message is persisted.
- `newChatNotification` and `newGlobalNotification` for unread messages when the recipient is not viewing the conversation.
- `reservationReleased` to update the listing status in the open conversation after a seller releases it.

## Data models

- **User:** role, student identity/contact/academic details, verification state and rejection reason, profile photo, and global unread-chat count.
- **Item:** seller, listing details, price, image URLs, pickup location, `available`/`reserved`/`sold` status, and soft-delete flag.
- **Chat:** buyer, seller, item, and one unread-message flag for each participant.
- **Message:** chat, sender, receiver, optional text/image, and seen state.
- **Purchase:** item, buyer, seller, pickup-location snapshot, `reserved`/`cancelled`/`completed`/`expired` status, code hash, expiry time, and completion time.

User, item, chat, and message schemas use Mongoose timestamps. Purchase currently does not enable schema timestamps.
