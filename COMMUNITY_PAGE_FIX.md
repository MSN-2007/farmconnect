# Community Page Port Error - Quick Fix

## Problem
Browser showing error:
```
Failed to fetch dynamically imported module: http://localhost:5175/src/pages/community.jsx
```

## Root Cause
The browser is trying to access port **5175** but Vite dev server is running on a different port (likely **5173**).

## Why This Happens
1. **Browser Cache**: Old port number cached in browser
2. **Multiple Dev Servers**: Multiple Vite instances running on different ports
3. **Hard Refresh Needed**: Browser needs to reload the app

## Solution

### Step 1: Clear Browser Cache
1. Open your browser (Chrome/Edge/Firefox)
2. Press `Ctrl + Shift + Delete`
3. Select "Cached images and files"
4. Click "Clear data"

### Step 2: Hard Refresh
1. Go to `http://localhost:5173` (the correct port)
2. Press `Ctrl + Shift + R` (hard refresh)
3. Or `Ctrl + F5`

### Step 3: Check Dev Server
Make sure only ONE dev server is running:
```bash
# Stop all running dev servers
# Then start fresh:
npm run dev
```

The terminal will show:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Step 4: Access Correct URL
Open: **http://localhost:5173** (NOT 5175)

## Quick Test
1. Stop all terminals running `npm run dev`
2. Start fresh: `npm run dev`
3. Note the port number shown
4. Open that exact URL in browser
5. Hard refresh: `Ctrl + Shift + R`

## If Still Not Working
The community page might have a syntax error. Check browser console (F12) for errors.

---

**Most Common Fix**: Hard refresh the browser (`Ctrl + Shift + R`) after going to the correct port.
