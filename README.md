# ElectroShop Manager

A **single-click desktop app** for electric shop owners to manage POS, inventory, and customer khata (ledger) — designed for non-technical users.

## Features

### Phase 1 (MVP) - ✅ Implemented
- 🏠 **Dashboard** with big tiles and today's summary
- 📦 **Add Stock** with smart product search & auto-suggestions
- 🧾 **New Sale** billing system (coming next)
- 📋 **Product Management** (coming next)
- 💾 **SQLite Database** with zero configuration
- 🖨️ **Print Support** via Electron

### Phase 2 - Planned
- 📚 Customer & Khata management
- 🔗 Linked billing and ledger system
- 💳 Payment recording

### Phase 3 - Planned
- 📊 Reports and analytics
- ⚠️ Low stock alerts
- 🌡️ Thermal printer support
- 💾 Backup & restore

## Tech Stack

- **App Shell**: Electron
- **Frontend**: Next.js (React) - Static Export
- **Backend**: Node.js + Express (inside Electron main process)
- **Database**: SQLite (`better-sqlite3`)
- **Packaging**: electron-builder

## Project Structure

```
electroshop-manager/
├── electron/
│   ├── main.js          # Electron main process
│   ├── preload.js       # Preload script for IPC
│   ├── api.js           # Express API routes
│   └── assets/          # App icons and resources
├── frontend/
│   ├── src/
│   │   ├── pages/       # Next.js pages
│   │   ├── components/  # React components
│   │   └── styles/      # CSS styles
│   ├── public/          # Static assets
│   ├── next.config.js   # Next.js config
│   └── tsconfig.json    # TypeScript config
├── database/
│   └── db.js            # Database initialization
├── dist/                # Built static files (generated)
├── release/             # Packaged app (generated)
└── package.json         # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   cd electroshop-manager
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm run electron:dev
   ```
   This starts the Next.js dev server on port 3000 and launches Electron.

3. **Build for production:**
   ```bash
   npm run build
   ```
   This exports the Next.js app and packages it with Electron.

4. **Create Windows installer:**
   ```bash
   npm run package
   ```
   Outputs to `release/` folder as `.exe` installer.

## Usage

### For End Users (Shopkeepers)
1. Download and install the `.exe` from the `release/` folder
2. Double-click the desktop shortcut to open
3. No login required (optional PIN can be set in Settings)
4. Start managing your shop!

### Key Workflows

#### Adding Stock
1. Click **"Add Stock"** on dashboard
2. Type product name → select from dropdown if exists, or add new
3. Enter quantity, prices, supplier
4. Click **"Save & Print"** → receipt prints automatically

#### Making a Sale
1. Click **"New Sale"** on dashboard
2. Search and add products to cart
3. Select customer (optional, required for khata)
4. Enter payment amount
5. Click **"Complete & Print"** → receipt prints, stock updates

#### Managing Khata
1. Click **"Customers & Khata"** on dashboard
2. View all customers with outstanding balances
3. Click any customer to see full ledger
4. Add payments or manual entries
5. Print statements

## Database Schema

The app uses SQLite with these main tables:
- `products` - Product master data
- `stock_entries` - Daily purchase log
- `customers` - Customer information
- `sales` - Sale transactions
- `sale_items` - Items in each sale
- `khata_entries` - Ledger entries per customer
- `settings` - App configuration

Database file location: `database/shop.db`

### Backup
Simply copy the `shop.db` file to backup all data. Restore by replacing the file.

## Customization

### Shop Information
Go to **Settings** to update:
- Shop name, address, phone
- Logo for receipts
- Default printer selection

### Categories & Units
Edit the dropdown lists in:
- `frontend/src/pages/stock.js` (for categories and units arrays)
- Or manage via Settings screen (Phase 3)

### Language
Currently English only. Urdu support planned in Phase 4 via i18n JSON files.

## Troubleshooting

### Printer not working
1. Go to Settings → Printer Setup
2. Click "Test Print" next to your printer
3. Ensure printer is connected and set as default in Windows

### App won't start
1. Delete `node_modules` folder
2. Run `npm install` again
3. Check if `database/shop.db` has write permissions

### Data lost
1. Locate your backup file (`shop.db`)
2. Replace current `database/shop.db` with backup
3. Restart app

## License

MIT License

## Support

For issues or feature requests, please contact the developer.

---

**Built with ❤️ for electric shop owners**
