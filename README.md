#  Dobby Vault — Full Stack Image & Folder Manager

A **Google Drive-inspired** full-stack app built with **React + Node.js + MongoDB**.

---

##  Features

-  **JWT Authentication** — Register, login, logout with bcrypt password hashing
-  **Nested Folders** — Infinite folder hierarchy with expand/collapse tree
-  **Image Upload** — Drag & drop with per-file progress bars
-  **Recursive Size Calculation** — Total folder size including all nested content
-  **Dark/Light Theme** — Persisted in localStorage
-  **Search & Sort** — Filter folders and images by name, date, or size
-  **Modern UI** — Glassmorphism, Framer Motion animations, skeleton loaders
-  **Recursive Delete** — Deletes all subfolders and images automatically
-  **Inline Rename** — Click context menu to rename folders
-  **Ownership Middleware** — Users only see their own data

---

##  Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Animations | Framer Motion |
| State | React Query (TanStack) |
| HTTP | Axios |
| Routing | React Router v6 |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt (manual) |
| Upload | Multer + Cloudinary (optional) |
| Notifications | React Hot Toast |

---

##  Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- (Optional) Cloudinary account for cloud image storage

---

### Backend

```bash
cd backend
npm install
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/cloudvault
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# Optional – leave blank to use local disk storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev   # starts on port 5000
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev   # starts on port 5173
```

---

##  API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/me` | Get current user |

### Folders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/folders` | All user folders (flat) |
| GET | `/api/folders/root` | Root-level folders + sizes |
| GET | `/api/folders/:id` | Folder + subfolders + breadcrumbs |
| POST | `/api/folders` | Create folder |
| PATCH | `/api/folders/:id` | Rename folder |
| DELETE | `/api/folders/:id` | Delete recursively |

### Images
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/images/upload` | Upload image (multipart) |
| GET | `/api/images/:folderId` | Get images in folder |
| DELETE | `/api/images/:id` | Delete image |

---

##  Project Structure

```
├── backend/
│   └── src/
│       ├── controllers/   authController, folderController, imageController
│       ├── middleware/    auth.js, errorHandler.js, ownership.js
│       ├── models/        User.js, Folder.js, Image.js
│       ├── routes/        auth.js, folders.js, images.js
│       └── utils/         jwt.js, cloudinary.js, recursive.js
└── frontend/
    └── src/
        ├── api/           axios.js, index.js
        ├── components/    layout/, folder/, image/, ui/
        ├── contexts/      AuthContext, ThemeContext
        ├── pages/         Login, Register, Dashboard, FolderView
        └── utils/         helpers.js
```

---

##  Demo Credentials

After creating a user via `/register`, use those credentials.
Or register: `demo@cloudvault.io` / `demo123`

---

##  Deployment

### Frontend → Vercel
```bash
cd frontend && npm run build
# Deploy dist/ to Vercel
```

### Backend → Render / Railway
```bash
# Set env vars on platform, deploy backend/ directory
# Start command: node src/app.js
```

### Database → MongoDB Atlas
- Create free cluster at mongodb.com
- Copy connection string to `MONGO_URI`
