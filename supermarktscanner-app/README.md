# Supermarktscanner React Native App

React Native mobile frontend for the Supermarktscanner product search experience. The app mirrors the Streamlit UI and communicates exclusively with the FastAPI backend located at `http://localhost:8000` (configurable).

## Features

- Location setup flow with address geocoding and nearby supermarket lookup
- Tab navigation with product search and interactive map views
- Detailed product cards with discount and promotion states
- Persistent location state via AsyncStorage
- Map visualisation with brand-coloured markers and radius overlay

## Getting Started

### Prerequisites

- Node.js v18+
- npm 9+ (installed with Node.js)
- Expo CLI (optional, commands below use `npx`)

### Installation

```bash
npm install
```

### Environment

Copy the sample environment file and adjust the API URL if needed:

```bash
cp env.sample .env
# .env
EXPO_PUBLIC_API_URL=http://localhost:8000
```

Expo automatically exposes variables prefixed with `EXPO_PUBLIC_` to the app at build/runtime.

Ensure the FastAPI backend is running locally before using the app.

### Running the App

```bash
npm run start      # Launch Expo Metro bundler
npm run ios        # Start iOS simulator (requires Xcode)
npm run android    # Start Android emulator (requires Android Studio)
npm run web        # Optional web preview
```

## Project Structure

```
src/
├── App.tsx
├── components/
│   ├── LocationHeader.tsx
│   ├── MapView.tsx
│   ├── ProductCard.tsx
│   └── ProductList.tsx
├── context/
│   └── LocationContext.tsx
├── screens/
│   ├── LocationSetupScreen.tsx
│   ├── MapScreen.tsx
│   └── ProductSearchScreen.tsx
├── services/
│   └── api.ts
├── types/
│   └── index.ts
└── utils/
    ├── constants.ts
    └── location.ts
```

## API Integration

The app uses the following endpoints:

- `POST /geocode` – Convert user address to latitude/longitude
- `POST /supermarkets` – Retrieve supermarkets within the specified radius
- `GET /search` – Search for products filtered by keyword and location
- `GET /health` – Health check (used in future enhancements)

Responses are handled via the Axios-based service layer (`src/services/api.ts`).

## Testing Checklist

- Location setup flow transitions to main tabs
- Product search fetches and displays results with correct discount states
- Map tab renders markers, radius circle, and sorted supermarket list
- Error states surface friendly messages for failed requests or empty data

## MCP Integration

This project is ready to interface with the installed MCP server for backend communication. Configure the server URL through the `.env` file if it differs from the default.

## License

MIT (update as needed).

