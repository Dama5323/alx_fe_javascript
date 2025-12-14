# Dynamic Quote Generator

A modern web application for generating, managing, and syncing inspirational quotes with advanced DOM manipulation and web storage features.

## Features

### 1. Dynamic Content Generation
- Random quote display with beautiful animations
- Category-based filtering system
- Real-time quote addition
- Responsive design with modern UI

### 2. Web Storage Integration
- **Local Storage**: Persist quotes across browser sessions
- **Session Storage**: Remember last viewed quote and user preferences
- Automatic data saving and loading

### 3. JSON Import/Export
- Export all quotes to JSON file
- Import quotes from JSON files
- Data validation and error handling

### 4. Server Sync Simulation
- Mock server interaction for data syncing
- Conflict detection and resolution
- Multiple resolution strategies:
  - Use server data
  - Keep local data
  - Merge both datasets

### 5. Advanced Features
- Real-time statistics display
- Category management system
- Notification system
- Conflict resolution modal
- Periodic automatic syncing

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/alx_fe_javascript.git
cd alx_fe_javascript/dom-manipulation
```

2. Open index.html in your web browser.

No build process or dependencies required - works directly in modern browsers.

### Usage
## Adding Quotes

- Enter quote text in the first input field

- Enter a category in the second input field

- Click "Add Quote" or press Enter


### Filtering Quotes
1. Select a category from the dropdown menu

2. View quotes only from that category

3. Click "Clear Filter" to show all quotes

### Import/Export
- Export: Click "Export Quotes" to download all quotes as JSON

- Import: Click "Import Quotes" and select a JSON file

### Syncing Data
- Click "Sync with Server" to simulate server sync

- Resolve conflicts using the modal dialog

- Automatic sync every 5 minutes


### Technical Implementation

### DOM Manipulation Techniques Used
- Dynamic element creation and modification

- Event delegation and handling

- Real-time UI updates

- Modal and notification systems

- Form handling and validation

### Web Storage Implementation
- localStorage for persistent data

- sessionStorage for session-specific data

- JSON serialization/deserialization

- Data integrity checks

### Conflict Resolution Strategy
- Timestamp-based conflict detection

- User-guided resolution options

- Data merging algorithms

- Automatic fallback strategies

### Browser Compatibility
- Chrome 60+

- Firefox 55+

- Safari 11+

- Edge 79+


### Testing
The application has been tested with:

- Various quote datasets

- Different browser sessions

- JSON import/export operations

- Conflict resolution scenarios

- Mobile and desktop viewports