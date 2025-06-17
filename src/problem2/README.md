# Currency Swap Interface

A modern, responsive currency swap interface built with React, TypeScript, and Material UI.

![Screenshot](./src/assets/screenshot.png)

## Features

- 🔄 Real-time currency conversion
- 🔍 Searchable token selection with autocomplete
- 💱 Live price fetching from Switcheo API
- 🎨 Modern UI with Material Design
- 📱 Fully responsive layout
- ⌨️ Keyboard navigation support
- ♿ Accessibility features
- ✅ Input validation
- 🧪 Comprehensive test coverage

## Tech Stack

- React 18
- TypeScript
- Material UI (MUI)
- Vite
- Jest + React Testing Library
- SCSS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/phamcong/code-challenge.git
cd src/problem2
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Running Tests

```bash
npm test
```

To view test coverage:
```bash
npm run test:coverage
```

## Project Structure

```
src/
├── __tests__/          # Test files
├── assets/             # Static assets
├── components/         # React components
├── utils.ts            # Utility functions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## API Integration

The application fetches token prices from:
```
https://interview.switcheo.com/prices.json
```

Token icons are sourced from Switcheo's token-icons repository:
```
https://github.com/Switcheo/token-icons
```

## Features in Detail

### Token Selection
- Searchable dropdown with token icons
- Keyboard navigation support
- Token filtering (excludes already selected token)
- Fallback handling for missing token icons

### Amount Input
- Real-time validation
- Numeric input with decimal support
- Automatic conversion between tokens
- Responsive to price changes

### Swap Functionality
- Instant token swap with position switching
- Maintains amount values during swap
- Real-time price calculations

### Error Handling
- Graceful handling of API failures
- Validation feedback
- Fallback UI states

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Token icons from [Switcheo Token Icons](https://github.com/Switcheo/token-icons/tree/main/tokens).
Price data from [Switcheo Interview API](https://interview.switcheo.com/prices.json).
