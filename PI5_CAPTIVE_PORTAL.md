# Raspberry Pi Captive Portal Setup

**Compatible Models:** Pi Zero W, Pi Zero 2 W, Pi 3, Pi 4, Pi 5

This guide will help you set up your Raspberry Pi as a WiFi access point with a captive portal that automatically shows guests the wedding seating chart when they connect.

## What This Does

When guests connect to your Pi's WiFi network:
1. They see an open network called "Christian-Chloe-Wedding"
2. When they connect (no password needed), their browser automatically opens
3. They're instantly shown the wedding seating chart
4. All web requests redirect to the seating chart

Perfect for weddings - no internet connection needed, works entirely offline!

## Hardware Requirements

- **Raspberry Pi with WiFi** - Any of these:
  - Pi Zero W (~$15) - Good for 20-50 guests
  - Pi Zero 2 W (~$15) - **RECOMMENDED** for most weddings (50-80 guests)
  - Pi 4 (~$35-45) - Best for 100+ guests
  - Pi 5 (~$60-80) - Overkill but bulletproof
  - See **PI_HARDWARE_GUIDE.md** for detailed comparison
- **MicroSD card** (16GB+ recommended, Class 10)
- **Power supply** for Pi (or battery bank for portable setup)
- **Optional:** Ethernet cable if you want to share internet access

## Quick Start

### 1. Prepare Your Raspberry Pi

1. Install Raspberry Pi OS (Lite or Desktop):
   - Download from: https://www.raspberrypi.com/software/
   - Use Raspberry Pi Imager to write to SD card
   - Configure username as `pi` (or update paths in scripts)

2. Boot up the Pi and connect via SSH or directly with keyboard/monitor

3. Update the system:
   ```bash
   sudo apt-get update
   sudo apt-get upgrade -y
   ```

### 2. Transfer Website Files

Copy all your wedding website files to the Pi:

**From your Mac:**
```bash
# Create wedding directory on Pi
ssh pi@raspberrypi.local "mkdir -p ~/wedding"

# Copy files (from your Mac, in the wedding directory)
scp index.html style.css script.js server.py seating_chart.csv pi@raspberrypi.local:~/wedding/

# Copy any other assets (favicon, images, etc.)
scp favicon.png pi@raspberrypi.local:~/wedding/
```

**Or use a USB drive:**
1. Copy files to USB drive
2. Plug into Pi
3. Mount and copy: `cp -r /media/usb/wedding/* ~/wedding/`

### 3. Run Setup Script

**From your Mac, transfer the setup script:**
```bash
scp pi_captive_portal_setup.sh pi@raspberrypi.local:~/
```

**On the Pi, run the setup:**
```bash
ssh pi@raspberrypi.local
chmod +x pi_captive_portal_setup.sh
sudo ./pi_captive_portal_setup.sh
```

The script will:
- Install hostapd (WiFi access point)
- Install dnsmasq (DHCP + DNS server)
- Configure captive portal redirection
- Set up the web server to auto-start
- Configure all services to run on boot

### 4. Reboot and Test

```bash
sudo reboot
```

After reboot:
1. Look for WiFi network: **"Christian-Chloe-Wedding"**
2. Connect (no password required)
3. Open any browser → you should see the seating chart!

## Customization

### Change WiFi Network Name

Edit `/etc/hostapd/hostapd.conf`:
```bash
sudo nano /etc/hostapd/hostapd.conf
```

Change the `ssid=` line:
```
ssid=Your-Custom-Name
```

Restart: `sudo systemctl restart hostapd`

### Add WiFi Password (Optional)

If you want to add a password, edit `/etc/hostapd/hostapd.conf`:
```bash
sudo nano /etc/hostapd/hostapd.conf
```

Add these lines:
```
wpa=2
wpa_passphrase=YourPassword123
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP CCMP
rsn_pairwise=CCMP
```

Restart: `sudo systemctl restart hostapd`

### Change WiFi Channel

If you experience interference, edit `/etc/hostapd/hostapd.conf`:
```
channel=11  # Try channels 1, 6, or 11 (least interference)
```

### Share Internet Connection (Optional)

If your Pi is connected to internet via Ethernet and you want guests to have internet access:

1. Uncomment this line in the setup script (or run manually):
   ```bash
   sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
   sudo netfilter-persistent save
   ```

2. Edit `/etc/dnsmasq.conf` and change:
   ```
   address=/#/10.0.0.1
   ```
   To only redirect specific captive portal domains:
   ```
   address=/captive.apple.com/10.0.0.1
   address=/connectivitycheck.gstatic.com/10.0.0.1
   address=/www.msftconnecttest.com/10.0.0.1
   server=8.8.8.8
   ```

## Troubleshooting

### WiFi Network Doesn't Appear

Check hostapd status:
```bash
sudo systemctl status hostapd
sudo journalctl -u hostapd -n 50
```

Common fixes:
```bash
# Restart the service
sudo systemctl restart hostapd

# Check for errors in config
sudo hostapd -d /etc/hostapd/hostapd.conf
```

### Can Connect but No Captive Portal

Check if website is running:
```bash
sudo systemctl status wedding-website
curl http://10.0.0.1:8080
```

Check dnsmasq:
```bash
sudo systemctl status dnsmasq
sudo tail -f /var/log/dnsmasq.log
```

Check iptables rules:
```bash
sudo iptables -t nat -L -v
```

### Captive Portal Doesn't Auto-Open

Some devices need manual browser opening. Try:
1. Open browser and go to any website (e.g., http://example.com)
2. You should be redirected to the seating chart

Or manually visit: `http://10.0.0.1:8080`

### Pi Won't Boot After Setup

If something went wrong:
1. Remove SD card
2. Mount on another computer
3. Edit `/boot/cmdline.txt` and add `init=/bin/bash` to boot to recovery
4. Or restore from backup

## Useful Commands

**View all service statuses:**
```bash
sudo systemctl status hostapd
sudo systemctl status dnsmasq
sudo systemctl status wedding-website
```

**Restart all services:**
```bash
sudo systemctl restart hostapd
sudo systemctl restart dnsmasq
sudo systemctl restart wedding-website
```

**View logs:**
```bash
# Access point logs
sudo journalctl -u hostapd -f

# DNS/DHCP logs
sudo tail -f /var/log/dnsmasq.log

# Website logs
sudo journalctl -u wedding-website -f
```

**See connected devices:**
```bash
# Check DHCP leases
cat /var/lib/misc/dnsmasq.leases

# Or active connections
iw dev wlan0 station dump
```

**Stop the access point:**
```bash
sudo systemctl stop hostapd
sudo systemctl stop dnsmasq
```

## Day-of-Wedding Checklist

1. **Power on Pi** at venue (15-30 minutes before guests arrive)
2. **Verify WiFi network** is broadcasting (check phone)
3. **Test connection** - connect and verify seating chart loads
4. **Place signs** - "Connect to WiFi: Christian-Chloe-Wedding"
5. **Position Pi centrally** for best coverage (range ~30-50 feet)

**Range extender tips:**
- Pi's WiFi reaches about 30-50 feet indoors
- Position centrally in venue
- Keep away from metal objects/walls if possible
- For larger venues, consider 2 Pi's with different channel numbers

## Power Considerations

**Battery power options:**
- USB power bank (20,000mAh = ~8 hours runtime)
- Portable power station
- Car battery with USB adapter

**Estimated runtime:**
- Pi 5 draws ~3-5W
- 20,000mAh battery bank = 8-12 hours
- Recommended: Test beforehand!

## Security Notes

- This is an **open network** (no password) - appropriate for public wedding use
- No internet access by default (isolated network)
- Only serves your static website - no data collection
- Guests cannot access each other's devices (AP isolation enabled in hostapd)

## Backup Plan

**If Pi fails:**
1. Have setup script and files on USB drive
2. Bring spare Pi (if budget allows)
3. Print backup seating charts as fallback
4. Have tablet/laptop ready to share if needed

## Performance

Expected performance:
- **Concurrent users:** 50-100 guests easily
- **Load time:** Instant (local network)
- **Reliability:** Very high (static content, no database)
- **Range:** 30-50 feet (typical indoor)

## After the Wedding

**Save the configuration:**
```bash
# Backup entire SD card for future events
# On Mac:
sudo dd if=/dev/diskX of=~/wedding-pi-backup.img bs=1m
```

**Disable services if using Pi for other purposes:**
```bash
sudo systemctl disable hostapd
sudo systemctl disable dnsmasq
sudo systemctl disable wedding-website
```

## Support

If you have issues:
1. Check logs (see "Useful Commands" above)
2. Restart services: `sudo systemctl restart hostapd dnsmasq wedding-website`
3. Reboot Pi: `sudo reboot`
4. Check /var/log/syslog for system errors

Have a wonderful wedding! 🎉
