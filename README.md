# Hype Music Foundry

A Foundry VTT module that plays custom hype music tracks when a player's turn begins in combat. Each player character can have their own unique entrance music!

## Features

- 🎵 **Custom Hype Tracks**: Assign unique music tracks to each player character
- 🎮 **Automatic Playback**: Music plays automatically when a character's turn begins in combat
- 🎚️ **Volume Control**: Adjustable volume settings for hype music
- 🎭 **GM Control**: Easy-to-use configuration interface for Game Masters
- ▶️ **Preview Tracks**: Preview tracks before assigning them to characters
- 🔇 **Auto-Stop**: Music stops when combat ends

## Installation

### Method 1: Manifest URL (Recommended when published)
1. In Foundry VTT, go to the **Add-on Modules** tab
2. Click **Install Module**
3. Paste the manifest URL: `https://github.com/yourusername/hype-music-foundry/releases/latest/download/module.json`
4. Click **Install**

### Method 2: Manual Installation
1. Download the latest release from the [releases page](https://github.com/yourusername/hype-music-foundry/releases)
2. Extract the zip file to your Foundry VTT `Data/modules` directory
3. The folder should be named `hype-music-foundry`
4. Restart Foundry VTT
5. Enable the module in your world's module settings

### Method 3: Development Installation
1. Navigate to your Foundry VTT `Data/modules` directory
2. Clone or copy this repository into a folder named `hype-music-foundry`
3. Restart Foundry VTT
4. Enable the module in your world's module settings

## Usage

### Initial Setup

1. **Enable the Module**: Activate "Hype Music Foundry" in your world's module settings
2. **Add Music to Playlists**: First, add all your desired hype tracks to Foundry VTT playlists
3. **Assign Player Ownership**: Make sure your player characters have player ownership configured

### Configuring Hype Tracks

#### Method 1: Module Settings
1. Go to **Settings** → **Module Settings**
2. Find "Hype Music Foundry" and click **Configure Hype Music**
3. For each player character, select a track from the dropdown menu
4. Use the **Preview** button (▶) to test tracks before saving
5. Click **Save Configuration**

#### Method 2: Actor Sheet Button
1. Open any player character's actor sheet (as GM)
2. Look for the music note icon (🎵) next to the character name
3. Click it to open the configuration dialog
4. Configure tracks as described above

### Combat Usage

1. Start a combat encounter as normal
2. When a player character's turn begins, their hype track will automatically play
3. The music stops when combat ends or when the next character's turn begins
4. Enable/disable the feature anytime via module settings

### Settings

**Enable Hype Music** (Default: On)
- Toggle automatic hype music playback during combat

**Hype Music Volume** (Default: 80)
- Set the volume level for hype tracks (0-100)
- Adjusts independently from other Foundry audio

## Requirements

- **Foundry VTT Version**: 11 or higher (verified up to v13)
- **Playlists**: Tracks must be added to playlists before they can be assigned
- **Player Ownership**: Actors must have player ownership configured

## Compatibility

This module is compatible with:
- Foundry VTT v11, v12, and v13
- All game systems
- Most other modules (please report any conflicts)

## Troubleshooting

**Music doesn't play during combat:**
- Verify the module is enabled in settings
- Check that "Enable Hype Music" setting is turned on
- Ensure the playlist containing the track still exists
- Verify the sound file is still accessible

**Can't see any tracks in the dropdown:**
- Add tracks to playlists first
- Refresh the configuration dialog

**Button doesn't appear on actor sheets:**
- Only visible to Game Masters
- Only appears on actors with player ownership
- Try refreshing the actor sheet

**Tracks play at wrong volume:**
- Adjust the "Hype Music Volume" setting
- Check your browser/OS audio settings

## Development

### Project Structure
```
hype-music-foundry/
├── lang/
│   └── en.json           # English localization
├── scripts/
│   └── hype-music.js     # Main module code
├── styles/
│   └── hype-music.css    # Module styles
├── templates/
│   └── config.html       # Configuration form template
├── module.json           # Module manifest
└── README.md            # This file
```

### Building from Source

This module doesn't require a build process. Simply copy the files to your modules directory.

### Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This module is released under the MIT License. See LICENSE file for details.

## Credits

Created for the Foundry VTT community.

## Support

- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/hype-music-foundry/issues)
- **Discord**: Join the Foundry VTT community Discord for support

## Changelog

### Version 1.0.0
- Initial release
- Basic hype music functionality
- GM configuration interface
- Volume controls
- Track preview
- Auto-play on combat turns
- Auto-stop on combat end

---

**Enjoy bringing epic hype to your combat encounters!** 🎵⚔️
