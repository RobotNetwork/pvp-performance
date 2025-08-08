# PvP Performance Tracker Web App

A React-based web application that mimics the functionality of the RuneLite PvP Performance Tracker plugin. Users can paste their fight data JSON and view detailed performance metrics with fight history persistence.

## Features

- **Fight Data Parsing**: Parse JSON fight data exported from the RuneLite plugin
- **Performance Metrics**: Display comprehensive fight statistics including:
  - Off-prayer hit success rates with visual difference indicators
  - Deserved damage calculations
  - Magic hit luck percentages
  - Offensive prayer success rates
  - HP healed during fights
  - Robe hit statistics
  - Ghost barrage tracking
- **Fight History**: Persistent storage of past fights with easy navigation
- **Winner Display**: Prominent winner announcement for each fight
- **Visual Comparisons**: Side-by-side metrics with difference indicators
- **Responsive Design**: Modern, mobile-friendly interface
- **Local Storage**: Fights are automatically saved to browser storage

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd pvptracker
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Paste Fight Data**: Copy your fight data JSON from the RuneLite plugin and paste it into the text area
2. **Analyze**: Click "Analyze Fight Data" to process and display the metrics
3. **View Results**: The application will display detailed statistics for both the competitor and opponent
4. **Browse History**: Click on any fight in the history panel to view its metrics
5. **Manage History**: Use the "Clear All" button to remove all saved fights

## UI Features

### Collapsible Input
- The JSON input area is collapsed by default to save space
- Click "Show JSON" to expand and view/edit the raw data
- Shows character count when data is loaded

### Winner Banner
- Displays the winner prominently at the top of the analysis
- Only shows when there's a clear winner (one player died)

### Visual Difference Indicators
- Green badges show when a player has better stats
- Red badges show when a player has worse stats (e.g., robe hits)
- Only the "better" stat shows the difference indicator

### Fight History
- Automatically saves each analyzed fight
- Shows fighter names, timestamp, and winner
- Displays quick stats (damage dealt, attack counts)
- Click any fight to view its full analysis
- Maintains last 50 fights in storage

## Fight Data Format

The application expects JSON data in the format exported by the RuneLite PvP Performance Tracker plugin:

```json
{
  "c": {
    "n": "PlayerName",
    "a": 68,
    "s": 42,
    "d": 491.901,
    "h": 603,
    "z": 21,
    "m": 13,
    "M": 9.460,
    "p": 65,
    "g": 0,
    "y": 0.000,
    "H": 398,
    "rh": 3,
    "x": false,
    "l": [...]
  },
  "o": {
    "n": "OpponentName",
    "a": 55,
    "s": 35,
    "d": 383.7,
    "h": 466,
    "z": 27,
    "m": 11,
    "M": 12.4,
    "p": 0,
    "g": 0,
    "y": 0.000,
    "H": 0,
    "rh": 8,
    "x": false,
    "l": [...]
  },
  "t": 1753392860333,
  "l": "UNKNOWN",
  "w": 0
}
```

## Metrics Explained

### Off-prayer Hits
- **Format**: `successful_hits/total_hits (percentage%)`
- **Description**: Hits landed when using a different combat style than the opponent's overhead prayer
- **Difference**: Shows `+X%` when one player has better off-prayer success

### Deserved Damage
- **Format**: `damage_value`
- **Description**: Theoretical damage based on gear, levels, and opponent's prayer usage
- **Difference**: Shows `+X` when one player deserved more damage

### Magic Hits
- **Format**: `actual_hits/total_magic_attacks (luck_percentage%)`
- **Description**: Magic attack success rate with luck percentage (100% = expected, >100% = lucky, <100% = unlucky)
- **Difference**: Shows `+X%` when one player had better magic luck

### Offensive Prayers
- **Format**: `successful_prayers/total_attacks (percentage%)`
- **Description**: Percentage of attacks where the correct offensive prayer was used

### Robe Hits
- **Format**: `hits_on_robes/melee_range_attacks (percentage%)`
- **Description**: Hits taken while wearing robe top and bottom during melee/range attacks
- **Difference**: Shows `-X%` when one player took fewer robe hits (better)

### Ghost Barrages
- **Format**: `count G.B. (deserved_damage)`
- **Description**: Number of ghost barrages and their deserved damage

## Technical Details

### Architecture
- **Frontend**: React with Vite
- **Styling**: CSS with responsive design
- **Data Parsing**: Custom parser based on Java plugin serialization patterns
- **Storage**: Browser localStorage for fight history

### Key Components
- `FightDataParser`: Handles JSON parsing and metric calculations
- `FightDataInput`: User interface for data input with collapsible textarea
- `FightMetricsDisplay`: Displays parsed metrics with difference indicators
- `FightHistory`: Manages and displays saved fights

### Data Structure
The parser extracts data using the same serialization patterns as the Java plugin:
- Single-letter field names for compact storage
- Nested fight log entries with detailed attack information
- Combat levels and equipment data

## Project Structure
```
pvptracker/
├── src/
│   ├── components/
│   │   ├── FightDataInput.jsx
│   │   ├── FightDataInput.css
│   │   ├── FightMetricsDisplay.jsx
│   │   ├── FightMetricsDisplay.css
│   │   ├── FightHistory.jsx
│   │   └── FightHistory.css
│   ├── utils/
│   │   └── fightDataParser.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
│   └── fightdataexample.json
└── package.json
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with example data
5. Submit a pull request

## License

This project is based on the RuneLite PvP Performance Tracker plugin and follows similar licensing terms.

## Acknowledgments

- Original RuneLite plugin by Matsyir
- React and Vite for the development framework
- RuneLite community for the plugin ecosystem
