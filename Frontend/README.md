# Agastya Hospitals - React Vite App

A modern, responsive hospital website built with React, Vite, and Tailwind CSS. This application showcases a comprehensive healthcare platform with multiple pages and interactive components.

## Features

- **Modern UI/UX**: Clean, professional design with hospital-themed color scheme
- **Responsive Design**: Fully responsive across all devices
- **Multi-page Routing**: React Router for seamless navigation
- **Interactive Components**: Carousels, accordions, and dynamic content
- **Tailwind CSS**: Utility-first CSS framework for styling

## Pages

1. **Home** - Landing page with all major sections
2. **About** - Hospital information and mission
3. **Specialties** - Medical specialties offered
4. **Find Doctor** - Doctor directory with booking
5. **Patient** - Patient portal and login
6. **Blog** - Health articles and news
7. **Health Packages** - Check-up packages and pricing
8. **Careers** - Job opportunities

## Sections on Home Page

- Hero Section with CTA buttons
- Specialties showcase
- Outstanding Care features
- Technology highlights
- Patient testimonials
- Doctor profiles
- Health packages
- Blog posts
- FAQ accordion

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Styling framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agastya-hospitals
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
agastya-hospitals/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx
│   │   ├── SpecialtiesSection.jsx
│   │   ├── OutstandingCareSection.jsx
│   │   ├── TechnologySection.jsx
│   │   ├── TestimonialsSection.jsx
│   │   ├── DoctorsSection.jsx
│   │   ├── HealthPackagesSection.jsx
│   │   ├── BlogSection.jsx
│   │   └── FAQSection.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Specialties.jsx
│   │   ├── FindDoctor.jsx
│   │   ├── Patient.jsx
│   │   ├── Blog.jsx
│   │   ├── HealthPackages.jsx
│   │   └── Careers.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Customization

### Colors

The color scheme can be customized in `tailwind.config.js`:

```javascript
colors: {
  'hospital-blue': '#1e40af',
  'hospital-light-blue': '#3b82f6',
  'hospital-dark-blue': '#1e3a8a',
  'hospital-red': '#dc2626',
  'hospital-gold': '#f59e0b',
}
```

### Content

All content is stored in the respective component files and can be easily modified to match your hospital's information.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support or questions, please contact the development team or create an issue in the repository. 