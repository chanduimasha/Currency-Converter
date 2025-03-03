# Currency Converter

A full-stack web application for converting currencies and tracking transfer history. The application allows users to convert between different currencies (USD, LKR, AUD, INR) in real-time using current exchange rates, and keeps a record of all conversions.

## Live Demo - https://drive.google.com/file/d/1GFf7FIJmniV1KL9C6ldqciVF2Too_eEw/view?usp=sharing

## Technologies Used

### Frontend
- **Next.js**: React framework for building the UI
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: Promise-based HTTP client for making API requests
- **React Icons**: Icon library for the interface

### Backend
- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework for the API
- **MongoDB/Mongoose**: Database and ODM for storing transfer data
- **Axios**: For fetching exchange rates from external API
- **Dotenv**: For environment variable management

### External APIs
- **ExchangeRate-API**: For real-time currency exchange rates

## Project Structure

```
currency-converter/
├── client/                  # Frontend Next.js application
│   ├── components/          # React components
│   │   ├── CurrencyConverter.tsx    # Main currency conversion form
│   │   ├── TransferHistory.tsx      # Display of transfer history
│   │   └── ...
│   ├── lib/                 # Utility functions and API handlers
│   │   └── api.ts           # Frontend API service for calling backend
│   ├── app/                 # Next.js pages
│   │   ├── page.tsx
│   ├── public/              # Static assets
│   ├── styles/              # Global styles
│   ├── next.config.js       # Next.js configuration
│   └── package.json         # Frontend dependencies
│
├── server/                  # Backend Express application
│   ├── models/              # Mongoose models
│   │   └── Transfer.js      # Transfer data schema
│   ├── routes/              # API routes
│   │   └── api.js           # Endpoints for rates and transfers
│   ├── .env                 # Environment variables (not in version control)
│   ├── server.js            # Express application entry point
│   └── package.json         # Backend dependencies
│
└── README.md                # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v14.x or later)
- npm or yarn
- MongoDB (local or Atlas)
- ExchangeRate-API key (get from [https://www.exchangerate-api.com/](https://www.exchangerate-api.com/))

### Backend Setup

1. Clone the repository:
   ```
   git clone - https://github.com/chanduimasha/Currency-Converter
   cd currency-converter/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following contents:
   ```
   PORT=5000
   MONGODB_URI= mongodb+srv://chandurathnayake01:gZzpQc247OtkWq28@cluster0.sh1r6.mongodb.net/
   EXCHANGE_RATE_API_KEY= 1d0645392bbdf09a78160f85
   ```

4. Start the server:
   ```
   npm start
   ```
   The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd ../client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the client directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```
   npm run dev
   ```
   The frontend will run on http://localhost:3000

5. For production build:
   ```
   npm run build
   npm start
   ```

## Features

- Real-time currency conversion with current exchange rates
- Support for multiple currencies (USD, LKR, AUD, INR)
- Transfer history tracking
- Responsive design for mobile and desktop
- Interactive UI with swap functionality for currencies

## API Endpoints

- `GET /api/rates`: Get the latest exchange rates
- `GET /api/transfers`: Get all transfer records
- `POST /api/transfers`: Create a new transfer record
- `DELETE /api/transfers/:id`: Delete a transfer record

## Future Enhancements

- Add user authentication
- Support for more currencies
- Transaction fee calculation
- Email notifications for transfers
- Exchange rate history graphs
- Currency rate alerts