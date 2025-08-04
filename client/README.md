# AgroConnect World - Homepage

A modern, responsive homepage for AgroConnect World, featuring a beautiful hero section, product highlights, and an interactive chatbot.

## Features

- 🎨 **Modern Design**: Clean, professional design with smooth animations
- 📱 **Fully Responsive**: Optimized for all devices and screen sizes
- 🚀 **Interactive Elements**: Smooth scroll animations and hover effects
- 💬 **Chatbot Integration**: Interactive chat button with expandable panel
- ⚡ **Performance Optimized**: Fast loading with optimized assets
- 🎯 **SEO Friendly**: Proper meta tags and semantic HTML

## Sections

1. **Navigation Bar**: Fixed header with logo, menu, and call-to-action buttons
2. **Hero Section**: Compelling headline with statistics and floating cards
3. **Product Highlights**: Three main solutions with feature lists
4. **Features Section**: Why choose AgroConnect World with statistics
5. **Testimonials**: Customer reviews and success stories
6. **Call-to-Action**: Final conversion section
7. **Footer**: Comprehensive site links and information
8. **Chatbot**: Interactive assistant for user support

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, customizable icons
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Responsive Design**: Mobile-first approach

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agroconnect-world/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the homepage

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## Project Structure

```
client/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── App.js             # Main React component
│   ├── App.css            # Component-specific styles
│   ├── index.js           # React entry point
│   └── index.css          # Global styles and utilities
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## Design System

### Colors
- **Primary**: `#2d5a27` (Forest Green)
- **Primary Light**: `#4a7c59` (Light Green)
- **Secondary**: `#f8b500` (Golden Yellow)
- **Accent**: `#e74c3c` (Red)
- **Text Primary**: `#2c3e50` (Dark Blue-Gray)
- **Text Secondary**: `#7f8c8d` (Light Gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales appropriately on all devices

### Components
- **Buttons**: Primary, Secondary, and Outline variants
- **Cards**: Product cards, testimonial cards, and stat cards
- **Navigation**: Fixed header with mobile menu
- **Chatbot**: Floating button with expandable panel

## Customization

### Adding New Sections
1. Create a new section component in `App.js`
2. Add corresponding styles in `App.css`
3. Include proper responsive breakpoints

### Modifying Colors
Update the CSS custom properties in `src/index.css`:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* ... other colors */
}
```

### Adding Animations
Use Framer Motion for smooth animations:
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  Your content here
</motion.div>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Lighthouse Score**: 90+ on all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@agroconnectworld.com
- Documentation: [docs.agroconnectworld.com](https://docs.agroconnectworld.com)
- Community: [community.agroconnectworld.com](https://community.agroconnectworld.com)

---

**AgroConnect World** - Revolutionizing Agriculture with Smart Technology 🌱 