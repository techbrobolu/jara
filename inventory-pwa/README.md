# Inventory PWA

This is a Progressive Web App (PWA) for managing store inventory. It allows users to track products, manage stock levels, and record sales, all while providing offline functionality and data synchronization with Supabase.

## Features

- **Offline Functionality**: The app uses Dexie.js for offline storage, allowing users to access and manage inventory without an internet connection.
- **Data Synchronization**: Automatically syncs data with Supabase when the device is back online, ensuring that all changes are reflected in the cloud.
- **Responsive Design**: The app is designed to work seamlessly on desktop, tablet, and mobile devices.
- **Real-time Updates**: Utilizes Supabase's real-time capabilities to keep the inventory data up-to-date across multiple devices.
- **User Authentication**: Supports user login and registration using Supabase authentication.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd inventory-pwa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

- Navigate through the app to manage products, view sales statistics, and record transactions.
- Use the search bar to filter products and the sort menu to organize the product list.
- Add or edit products using the provided forms.

## Deployment

To deploy the app, you can use platforms like Vercel or Netlify. Ensure that the environment variables for Supabase are correctly set in your deployment settings.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.