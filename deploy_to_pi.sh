#!/bin/bash
# Helper script to deploy wedding website to Raspberry Pi

# Configuration
PI_HOST="raspberrypi.local"  # Change to your Pi's hostname or IP
PI_USER="pi"
PI_DEST="~/wedding"

echo "Deploying wedding website to Raspberry Pi..."
echo ""

# Check if we can reach the Pi
if ! ping -c 1 -W 1 $PI_HOST > /dev/null 2>&1; then
    echo "Error: Cannot reach $PI_HOST"
    echo "Make sure:"
    echo "  1. The Pi is powered on"
    echo "  2. You're on the same network"
    echo "  3. SSH is enabled on the Pi"
    echo ""
    echo "Try using Pi's IP address instead:"
    echo "  Edit this script and change PI_HOST to something like '192.168.0.100'"
    exit 1
fi

# Create wedding directory on Pi if it doesn't exist
echo "Creating directory on Pi..."
ssh ${PI_USER}@${PI_HOST} "mkdir -p ${PI_DEST}"

# Copy website files
echo "Copying files..."
scp index.html style.css script.js server.py seating_chart.csv ${PI_USER}@${PI_HOST}:${PI_DEST}/

# Copy favicon if it exists
if [ -f favicon.png ]; then
    scp favicon.png ${PI_USER}@${PI_HOST}:${PI_DEST}/
fi

# Copy any other assets
if [ -d assets ]; then
    scp -r assets ${PI_USER}@${PI_HOST}:${PI_DEST}/
fi

# Restart the website service if it's running
echo "Restarting website service..."
ssh ${PI_USER}@${PI_HOST} "sudo systemctl restart wedding-website 2>/dev/null || true"

echo ""
echo "✓ Deployment complete!"
echo ""
echo "Test the website:"
echo "  http://${PI_HOST}:8080"
echo ""
echo "If you've set up the captive portal:"
echo "  1. Connect to 'Christian-Chloe-Wedding' WiFi"
echo "  2. Open any browser"
echo ""
