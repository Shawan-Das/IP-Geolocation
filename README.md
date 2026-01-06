# 🌍 IP Geolocation Map

A modern, interactive web application that allows users to track and visualize IP addresses on a map. Discover the geographic location of any IP address with real-time mapping, distance calculations, and multi-location tracking.

![IP Geolocation Map](https://bolt.new/static/og_default.png)

## ✨ Features

### 🗺️ Interactive Mapping
- **OpenStreetMap Integration**: Free, open-source map tiles
- **Multiple Location Tracking**: Add and manage multiple IP addresses
- **Color-Coded Markers**: Each IP gets a unique colored marker
- **Connecting Lines**: Visual paths between locations
- **Auto-Zoom**: Map automatically adjusts to show all locations

### 📍 Location Intelligence
- **Real-time IP Lookup**: Get detailed information for any IP address
- **Distance Calculations**:
  - Distance from your current location to target IPs
  - Sequential distances between searched locations
- **Geographic Details**: City, region, country, postal code, coordinates
- **ISP Information**: Internet service provider and organization details
- **Timezone Data**: Local time and timezone information

### 🎨 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Interactive Controls**: Add, remove, and reorder IP addresses
- **Real-time Updates**: Map updates instantly as you manage locations
- **Session-based Storage**: Data persists until page refresh

### 🔧 Technical Features
- **TypeScript**: Full type safety and better development experience
- **React 18**: Modern React with hooks and concurrent features
- **Vite**: Lightning-fast build tool and development server
- **ESLint**: Code quality and consistency
- **Leaflet Maps**: Powerful, lightweight mapping library

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shawan-Das/IP-Geolocation.git
   cd IP-Geolocation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## 📖 Usage

### Basic IP Lookup
1. Enter an IP address in the search box
2. Click "Lookup" or press Enter
3. View the location on the map with detailed information

### Multi-IP Tracking
1. Search for multiple IP addresses
2. Each IP gets a unique colored marker on the map
3. View distances from your location and between IPs
4. Use controls to reorder or remove IP addresses

### Map Features
- **Click markers** to see detailed information
- **Zoom and pan** to explore the map
- **Connecting lines** show relationships between locations
- **Responsive design** adapts to your screen size

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - Modern React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **PostCSS** - CSS processing

### Mapping
- **Leaflet** - Open-source JavaScript library for mobile-friendly interactive maps
- **React Leaflet** - React components for Leaflet maps
- **CartoDB Positron** - Clean, modern map tiles (free, no API key required)

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Autoprefixer** - CSS vendor prefixing

### APIs
- **IP Geolocation API** - Location data for IP addresses
- **Supabase** - Backend services (optional)

## 📁 Project Structure

```
IP-Geolocation/
├── public/
│   ├── favicon.ico          # Website favicon
│   └── vite.svg            # Vite logo
├── src/
│   ├── components/
│   │   ├── MapView.tsx     # Main map component
│   │   └── IPDetailsCard.tsx # IP information display
│   ├── types.ts            # TypeScript type definitions
│   ├── utils.ts            # Utility functions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This file
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

## 🌐 API Information

This application uses a free IP geolocation API to fetch location data. The API provides:

- Geographic coordinates (latitude/longitude)
- City, region, and country information
- ISP and organization details
- Timezone and local time
- Postal codes and more

**Note**: The API has rate limits. For production use, consider implementing your own API key or caching mechanism.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shawan Das**
- GitHub: [https://github.com/Shawan-Das](https://github.com/Shawan-Das)
- Project Link: [https://github.com/Shawan-Das/IP-Geolocation](https://github.com/Shawan-Das/IP-Geolocation)

## 🙏 Acknowledgments

- [OpenStreetMap](https://www.openstreetmap.org/) for the map data
- [CartoDB](https://carto.com/) for the beautiful Positron map tiles
- [Leaflet](https://leafletjs.com/) for the mapping library
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Lucide](https://lucide.dev/) for the beautiful icons
- [Vite](https://vitejs.dev/) for the build tool

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the author.

---

⭐ **Star this repo** if you found it helpful!
