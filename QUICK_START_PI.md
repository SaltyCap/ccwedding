# Quick Start - Raspberry Pi Captive Portal

**Compatible with:** Pi Zero W, Pi Zero 2 W, Pi 3, Pi 4, Pi 5

**Goal:** Guests connect to WiFi → automatically see seating chart

## One-Time Setup (Before Wedding)

### 1. Prepare Pi
```bash
# On Pi, update system
sudo apt-get update && sudo apt-get upgrade -y
```

### 2. Copy Files to Pi
```bash
# From your Mac (run from wedding directory)
scp index.html style.css script.js server.py seating_chart.csv favicon.png pi@raspberrypi.local:~/wedding/
scp pi_captive_portal_setup.sh pi@raspberrypi.local:~/
```

### 3. Run Setup
```bash
# SSH to Pi
ssh pi@raspberrypi.local

# Run setup script
chmod +x pi_captive_portal_setup.sh
sudo ./pi_captive_portal_setup.sh

# Reboot
sudo reboot
```

## Wedding Day

1. **Power on Pi** (at venue, 30 min before guests)
2. **Look for WiFi:** "Christian-Chloe-Wedding"
3. **Test:** Connect with phone → should auto-open seating chart
4. **Done!** Let guests connect

## If Something Goes Wrong

```bash
# Restart everything
sudo systemctl restart hostapd dnsmasq wedding-website

# Or just reboot
sudo reboot
```

## Customization

**Change WiFi name:**
```bash
sudo nano /etc/hostapd/hostapd.conf
# Edit: ssid=Your-Name-Here
sudo systemctl restart hostapd
```

**Update seating chart:**
```bash
# Copy new CSV from your Mac
scp seating_chart.csv pi@raspberrypi.local:~/wedding/
# No restart needed - refreshes automatically
```

---
See **PI5_CAPTIVE_PORTAL.md** for full documentation
