# TextService Converter

A full-stack application that converts pipe-delimited TextService format to XML or JSON.

## Tech Stack

**Frontend:**
- Vue 3 (Composition API)
- TypeScript
- Vuetify 3 (Material Design)
- Pinia (State Management)
- Vite (Build Tool)
- Axios (HTTP Client)

**Backend:**
- Node.js
- Express.js
- TypeScript
- sql.js (SQLite Database)
- CORS

**DevOps:**
- Docker & Docker Compose
- Nginx (Production Frontend)
- Multi-stage Docker builds

## Getting Started

```bash
git clone git@github.com:wincentek/softhouse.git
cd textservice-converter
```

## Quick Start

### Docker (Recommended)
```bash
docker-compose up
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1/textservice

### Manual Setup

**Backend:**
```bash
cd backend
npm install
npm run seed    # Create and populate database
npm run dev     # Development server on port 3001
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev     # Development server on port 3000
```

## Port Configuration

### Docker Compose (`docker-compose.yml`)
```yaml
services:
  frontend:
    ports:
      - "3000:80"    # Change 3000 to desired port
  backend:
    ports:
      - "3001:3001"  # Change first 3001 to desired port
```

### Local Development
- **Backend**: Edit `backend/.env` → `PORT=3001`
- **Frontend**: Edit `frontend/vite.config.ts` → `server.port: 3000`

## Usage

Open your browser and navigate to `http://localhost:3000`

1. **Fetch data**: Enter URL and click "Fetch" to load TextService data
2. **Switch modes**: 
   - **TEXT**: Manual editing and pasting - only mode where you can modify input data
   - **XML/JSON**: Read-only display of converted output
3. **Copy output**: Use "Copy" button to save results to clipboard
4. **Clear**: Reset all data with the "×" button
5. **Errors**: Check the developer console for additional info.

The application includes toast notifications for user feedback and comes pre-loaded with sample TextService data for testing.