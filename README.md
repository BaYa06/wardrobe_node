# Wardrobe App

Wardrobe App is a web application for managing your wardrobe with features like adding and deleting clothes, displaying weather forecasts, and automatically picking outfits based on the current weather. Users can upload clothing images, categorize them by type (e.g., Head, Shoes, Outerwear) and weather (Sunny, Rainy, etc.), view them in a convenient carousel, and get outfit suggestions.

## Key Features
- **Add Clothes:** Upload images via a modal window, specifying the clothing type and suitable weather.
- **Delete Clothes:** Remove wardrobe items using a "trash" icon button.
- **Display:** View wardrobe items as cards and in carousels (powered by Materialize CSS).
- **Filtering:** Display clothes by type (e.g., only "Shoes" or "Head").
- **Weather:** Shows today's weather and a 7-day forecast (integrated with a weather API).
- **Carousel:** A user-friendly carousel for browsing clothes by category.
- **Pick Up:** A "Pick Up" button that selects an outfit based on today’s weather.

## Technologies
- **Frontend:**
  - HTML, CSS, JavaScript (ES Modules)
  - Materialize CSS for carousels and styling
  - jQuery (for Materialize)
  - Ionicons for icons
- **Backend:**
  - Node.js with Koa.js framework
  - Knex.js for PostgreSQL database interaction
  - ImgBB API for image storage
  - OpenWeatherMap API (or similar) for weather forecasts
- **Database:**
  - PostgreSQL
- **Tools:**
  - npm for dependency management

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (installed and running)
- ImgBB account and API key ([get it here](https://imgbb.com/))
- OpenWeatherMap API key ([get it here](https://openweathermap.org/api))

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BaYa06/wardrobe_node.git
   cd wardrobe-app

    ```bash
    wardrobe-app/
    ├── controllers/        # Controllers (handle request logic)
    │   ├── authController.js      # Handles user authentication (login, registration)
    │   ├── weatherController.js   # Fetches weather data and processes recommendations
    │   ├── clothesController.js   # Manages clothing data
    │
    ├── middleware/         # Middleware (authentication, validation)
    │   ├── authMiddleware.js     # Middleware for authentication
    │   ├── validationMiddleware.js # Middleware for request validation
    │
    ├── models/            # Database models (users, weather, clothing)
    │   ├── user.js         # User model (MongoDB schema)
    │   ├── weather.js      # Weather model (storing weather data if needed)
    │   ├── clothes.js      # Clothes model (storing clothing options)
    │
    ├── routes/            # API routes (authentication, registration, weather data)
    │   ├── auth.js         # Routes for login, registration
    │   ├── weather.js      # Routes for fetching weather data
    │   ├── clothes.js      # Routes for clothing selection
    │
    ├── public/            # Static files (CSS, JS, images, etc.)
    │   ├── css/           # Stylesheets
    │   ├── js/            # JavaScript files
    │   ├── images/        # Uploaded images
    │
    ├── views/             # Frontend views (if using a templating engine)
    │   ├── index.html     # Main webpage
    │   ├── login.html     # Login page
    │   ├── register.html  # Registration page
    │
    ├── config/            # Configuration files
    │   ├── db.js          # Database configuration
    │   ├── config.js      # Other project settings
    │
    ├── server.js          # Main server file (Node.js and Express setup)
    ├── package.json       # Project dependencies
    ├── package-lock.json  # Dependency lock file