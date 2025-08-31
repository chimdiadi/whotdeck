# Whot Cards Example UI

This is an interactive demo application showcasing the Whot card library features.

## Features Demonstrated

- **Deck Management**: Create, shuffle, draw, and deal cards
- **Rendering Backends**: Toggle between template and programmatic renderers
- **Theme Customization**: Light, dark, and high-contrast themes
- **Grid Layout**: Configurable card grid display
- **SVG Export**: Export rendered cards as SVG
- **Multiple Decks**: Support for combining multiple decks
- **Custom Whot Labels**: Configurable labels for Whot cards
- **Deterministic Shuffling**: Seeded random number generation

## Running the Example

### Option 1: Using npm (Recommended)
```bash
# From the project root
npm run example

# Or directly from this directory
cd examples/simple-ui
npm run dev
```

### Option 2: Build and Serve
```bash
# Build the example
npm run example:build

# Serve the built files
cd examples/simple-ui
npm run preview
```

## Accessing the Application

Once running, open your browser to:
- **Development**: http://localhost:3000
- **Preview**: http://localhost:4173 (after building)

## Usage Guide

### Deck Controls
- **Number of Decks**: Set how many decks to combine (1-10)
- **Whot Label**: Customize the label for Whot cards
- **Random Seed**: Set for deterministic shuffling (optional)
- **Renderer**: Choose between template and programmatic backends

### Actions
- **New Deck**: Create a fresh deck
- **Shuffle**: Randomize card order
- **Reset**: Restore deck to initial state
- **Draw**: Take cards from the top
- **Deal**: Distribute cards to multiple players

### Display Options
- **Grid Columns**: Configure card layout
- **Theme**: Switch between light, dark, and high-contrast
- **Export SVG**: Download rendered cards

## Troubleshooting

### Common Issues

1. **Module Loading Errors**: Make sure you're using the Vite dev server, not a static file server
2. **Port Already in Use**: The server will automatically find an available port
3. **Build Errors**: Ensure the main library is built first (`npm run build`)

### Development

To modify the example:
1. Edit `main.ts` for functionality changes
2. Edit `style.css` for styling changes
3. Edit `index.html` for structure changes
4. The server will automatically reload on changes

## Technical Details

- **Framework**: Vanilla TypeScript with Vite
- **Library Integration**: Direct import from `whotdeck`
- **Styling**: CSS with theme variables
- **Build Tool**: Vite for fast development and optimized builds
