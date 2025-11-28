# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a wedding seating chart web application for Christian & Chloe's wedding. It allows guests to search their names and find their table assignments with an interactive seating map.

## Architecture

**Frontend (Static Website)**
- `index.html` - Main HTML structure with embedded SVG seating map
- `style.css` - Elegant wedding-themed styling with animations
- `script.js` - Client-side JavaScript for search, filtering, and map interactions
- `seating_chart.csv` - Guest list with table assignments (loaded dynamically)
- Dependencies: PapaParse (CSV parsing library loaded via CDN)

**Data Management (Python Scripts)**
- `sync_chart_to_website.py` - Syncs table assignments from `seating_chart.csv` to `people.csv`
- Uses fuzzy name matching to handle variations (nicknames, "+1" guests, etc.)
- Maintains a `people.csv` file with full guest details and RSVP information

**Data Files**
- `people.csv` - Complete guest database with RSVP status, contact info, and table assignments
- `seating_chart.csv` - Published seating chart (Guest Name, Table Number) used by the website

## Key Functionality

**Guest Search**
- Real-time filtering as users type (minimum 2 characters)
- Case-insensitive matching on guest names
- Auto-highlights table on map when single result found
- "View All Guests" toggle to display complete list

**Interactive Map**
- SVG-based seating layout with 13 numbered tables plus head table
- Tables are clickable but modal functionality references removed elements (incomplete feature)
- Clicking guest cards highlights and scrolls to their table on the map
- Animated table highlighting with gold glow effect

## Common Development Tasks

**Updating Seating Assignments**
1. Edit `seating_chart.csv` with new assignments
2. Run `python sync_chart_to_website.py` to update `people.csv` (optional)
3. The website automatically loads from `seating_chart.csv`

**Testing Locally**
- Use the included server script:
  ```bash
  python3 server.py
  ```
- Or use Python's built-in server:
  ```bash
  python3 -m http.server 8000
  ```
- Open `http://localhost:8080` (or port 8000) in browser
- CSV files must be served via HTTP (not file://) for CORS compliance

**Hosting with DuckDNS**
- See `HOSTING_SETUP.md` for complete DuckDNS hosting instructions
- `server.py` - Production-ready HTTP server (default port 8080)
- `update_duckdns.sh` - DuckDNS dynamic DNS update script (configure with your domain/token)
- `wedding-server.service` - systemd service file for Linux
- `com.wedding.server.plist` - launchd service file for macOS
- IMPORTANT: Never commit `update_duckdns.sh` with your token (already in .gitignore)

## Important Notes

- The modal popup code in `script.js` (lines 139-179) references DOM elements that don't exist in `index.html`, so clicking tables won't show guest lists
- Name matching in `sync_chart_to_website.py` includes special cases for nicknames (e.g., "Regan" → "Reagan", "Bev" → "Beverly")
- Table numbers in the CSV must match the SVG table IDs (format: `table-{number}`)
- The head table has no data-table attribute and cannot be highlighted
