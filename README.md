# Bulk Video Converter

Bulk Video Converter is a free, open-source tool that allows users to convert videos to MP4 format and extract audio from video files. It provides a user-friendly web interface for easy file management and conversion.

![Video Converter Home Page](/static/home.png)

## Features

- Bulk video conversions
- Convert videos to MP4 format
- Extract audio from video files (MP3 format)
- Drag-and-drop file upload
- Real-time conversion progress
- Gallery view for converted files
- Power rename feature for batch file renaming

## Tech Stack

- Backend: Node.js with Express
- Frontend: React with Vite
- Styling: Tailwind CSS
- Video Processing: FFmpeg
- Real-time updates: Socket.IO

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/justinkarso/ffmpeg-bulk-converter-ui.git
   cd ffmpeg-bulk-converter-ui
   ```

2. Install dependencies:

   ```
   pnpm install
   cd client
   pnpm install
   cd ..
   ```

3. (important) Create necessary directories:
   ```
   mkdir uploads output
   ```

## Building and running the app

1. Build the frontend:

   ```
   pnpm run build // from the root directory
   ```

2. Start the production server:
   ```
   pnpm start // from the root directory
   ```

## Styling the frontend

1.  Run development server
    ```
    pnpm dev
    ```

## Usage

1. Navigate to the home page and choose the desired conversion option:

   - Convert to MP4
   - Video to Audio
   - Gallery

2. For video conversion or audio extraction:

   - Drag and drop files or click to select files
   - Use the "Power Rename" feature to batch rename files if needed
   - Click "Convert" or "Extract Audio" to start the process
   - Monitor real-time progress for each file

3. Access converted files in the Gallery section:
   - Play videos or audio directly in the browser
   - Open the file location on your computer

## Development

- Backend code is located in `app.js`
- Frontend code is in the `client` directory
- Main React components:
  - `App.jsx`: Main application component
  - `convert-to-mp4.jsx`: Video to MP4 conversion page
  - `video-to-audio.jsx`: Video to audio extraction page
  - `gallery.jsx`: Gallery page for converted files

## License

This project is open source and available under the [MIT License](LICENSE.txt)
