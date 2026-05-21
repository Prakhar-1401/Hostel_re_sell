# Hostel Marketplace

A buy/sell marketplace exclusively for hostel students. Leaving students sell used items, incoming students buy affordable second-hand products.

## Tech Stack

- **Backend**: Django + Django REST Framework
- **Frontend**: React + Vite + Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **Image Storage**: Cloudinary
- **Backend Hosting**: Render
- **Frontend Hosting**: Vercel

## Features

- JWT Authentication (signup, login, logout)
- Dynamic auto-generated product categories
- Multiple image upload via Cloudinary
- Product CRUD operations
- Search & filtering (price, condition, category, hostel)
- User dashboard with listing management
- WhatsApp direct contact button
- Mobile-first responsive design
- Skeleton loading states
- Admin panel (Django Admin)

## Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt

# Copy env file and configure
cp .env.example .env
# Edit .env with your database URL, Cloudinary keys, etc.

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

## Environment Variables

### Backend (.env)

| Variable | Description |
|----------|-------------|
| SECRET_KEY | Django secret key |
| DEBUG | True/False |
| DATABASE_URL | PostgreSQL connection string (Supabase) |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |
| CORS_ALLOWED_ORIGINS | Comma-separated frontend URLs |
| ALLOWED_HOSTS | Comma-separated allowed hosts |

### Frontend (.env)

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API base URL |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup/ | Register new user |
| POST | /api/auth/login/ | Login (returns JWT) |
| POST | /api/auth/logout/ | Logout |
| GET | /api/auth/profile/ | Get user profile |
| PUT | /api/auth/profile/ | Update profile |
| GET | /api/categories/ | List all categories |
| GET | /api/products/ | List products (paginated) |
| POST | /api/products/create/ | Create product listing |
| GET | /api/products/:id/ | Product detail |
| PATCH | /api/products/:id/update/ | Update product |
| DELETE | /api/products/:id/delete/ | Delete product |
| GET | /api/products/my-listings/ | Current user's listings |

### Query Parameters for /api/products/

- `search` - Search by name, description
- `category` - Filter by category slug
- `condition` - Filter by condition
- `min_price` / `max_price` - Price range
- `hostel` - Filter by hostel name
- `ordering` - Sort: `price`, `-price`, `created_at`, `-created_at`
- `page` - Pagination

## Deployment

### Backend on Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repo
3. Settings:
   - **Build Command**: `cd backend && chmod +x build.sh && ./build.sh`
   - **Start Command**: `cd backend && gunicorn config.wsgi:application`
   - **Environment**: Python 3
4. Add all environment variables from `.env.example`

### Frontend on Vercel

1. Import project on [Vercel](https://vercel.com)
2. Set root directory to `frontend`
3. Framework Preset: Vite
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

### Database on Supabase

1. Create project on [Supabase](https://supabase.com)
2. Go to Settings > Database > Connection string
3. Use the URI format for `DATABASE_URL`

### Images on Cloudinary

1. Create free account on [Cloudinary](https://cloudinary.com)
2. Get Cloud Name, API Key, API Secret from Dashboard

## Project Structure

```
backend/
├── config/          # Django settings, URLs, WSGI
├── apps/
│   ├── users/       # Custom user model, auth views
│   ├── products/    # Product CRUD, images, filters
│   └── categories/  # Dynamic category system
├── manage.py
├── requirements.txt
├── Procfile
└── build.sh

frontend/
├── src/
│   ├── components/  # Navbar, ProductCard, ProtectedRoute
│   ├── pages/       # Home, Buy, Sell, Login, Signup, Dashboard, etc.
│   ├── context/     # AuthContext
│   ├── services/    # API client (axios)
│   └── main.jsx
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Admin Panel

Access Django Admin at `/admin/` with superuser credentials.

Admin can:
- Remove spam listings
- Ban users (set is_active=False)
- Edit/delete products
- Manage categories

## License

MIT
