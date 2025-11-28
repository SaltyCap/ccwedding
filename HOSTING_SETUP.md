# DuckDNS Hosting Setup Guide

This guide will help you host your wedding seating chart using DuckDNS for dynamic DNS.

## Prerequisites

- A DuckDNS account (free at https://www.duckdns.org)
- Your DuckDNS subdomain (e.g., `yourname.duckdns.org`)
- Your DuckDNS token (found on the DuckDNS website after logging in)
- Python 3 installed
- Port forwarding access on your router

## Step 1: Configure DuckDNS

1. Go to https://www.duckdns.org and sign in
2. Create a subdomain (e.g., `christian-chloe-wedding`)
3. Copy your token from the top of the page
4. Edit `update_duckdns.sh` and update:
   ```bash
   DOMAIN="your-domain"  # Replace with your subdomain (without .duckdns.org)
   TOKEN="your-token"    # Replace with your DuckDNS token
   ```

5. Test the script:
   ```bash
   ./update_duckdns.sh
   ```
   You should see "DuckDNS update successful"

## Step 2: Set Up Automatic DuckDNS Updates

Your IP address may change, so set up automatic updates:

### Option A: Cron (Linux/macOS)

Add to your crontab (`crontab -e`):
```bash
*/5 * * * * /Users/christian/Desktop/code_projects/wedding/update_duckdns.sh
```
This updates every 5 minutes.

### Option B: launchd (macOS)

Create `/Users/christian/Library/LaunchAgents/com.duckdns.updater.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.duckdns.updater</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/christian/Desktop/code_projects/wedding/update_duckdns.sh</string>
    </array>
    <key>StartInterval</key>
    <integer>300</integer>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

Then load it:
```bash
launchctl load ~/Library/LaunchAgents/com.duckdns.updater.plist
```

## Step 3: Configure the Web Server

Edit `server.py` if you want to change the port (default is 8080):
```python
PORT = 8080  # Change to 80 for standard HTTP (requires sudo)
```

Test the server:
```bash
python3 server.py
```

Visit http://localhost:8080 to verify it works.

## Step 4: Configure Port Forwarding

1. Find your local IP address:
   - macOS: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Linux: `ip addr show | grep "inet "`

2. Access your router's admin panel (usually http://192.168.1.1 or http://192.168.0.1)

3. Set up port forwarding:
   - External Port: 80 (HTTP)
   - Internal Port: 8080 (or whatever you set in server.py)
   - Internal IP: Your computer's local IP
   - Protocol: TCP

4. If using port 80 externally, you may need to run the server with sudo:
   ```bash
   sudo python3 server.py
   ```
   Or keep it on 8080 and forward 80→8080 in your router.

## Step 5: Set Up Persistent Hosting

### macOS (using launchd)

1. The file `com.wedding.server.plist` is already created
2. Load the service:
   ```bash
   cp com.wedding.server.plist ~/Library/LaunchAgents/
   launchctl load ~/Library/LaunchAgents/com.wedding.server.plist
   ```

3. Check if it's running:
   ```bash
   launchctl list | grep wedding
   ```

4. View logs:
   ```bash
   tail -f /tmp/wedding-server.log
   tail -f /tmp/wedding-server-error.log
   ```

5. To stop the service:
   ```bash
   launchctl unload ~/Library/LaunchAgents/com.wedding.server.plist
   ```

### Linux (using systemd)

1. Edit `wedding-server.service` and update:
   - `User=YOUR_USERNAME` → your Linux username
   - `/path/to/wedding` → actual path to this directory

2. Copy and enable the service:
   ```bash
   sudo cp wedding-server.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable wedding-server.service
   sudo systemctl start wedding-server.service
   ```

3. Check status:
   ```bash
   sudo systemctl status wedding-server.service
   ```

4. View logs:
   ```bash
   sudo journalctl -u wedding-server.service -f
   ```

## Step 6: Test External Access

1. From your local network, visit: `http://your-domain.duckdns.org`
2. From an external network (mobile data), visit the same URL
3. Your wedding seating chart should load!

## Firewall Configuration

If using macOS firewall:
```bash
# Allow incoming connections to Python
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/bin/python3
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/bin/python3
```

If using Linux firewall (ufw):
```bash
sudo ufw allow 8080/tcp
# Or if using port 80:
sudo ufw allow 80/tcp
```

## Security Considerations

1. **HTTPS**: This setup uses HTTP only. For HTTPS, consider:
   - Using Caddy server (automatic HTTPS)
   - Setting up nginx with Let's Encrypt
   - Using Cloudflare as a reverse proxy

2. **Access Control**: This is a public website. If you need password protection:
   - Add basic auth to the server
   - Use Cloudflare Access
   - Set up nginx with auth_basic

3. **DDoS Protection**: Consider using Cloudflare (free tier) as a reverse proxy

## Troubleshooting

**Can't access from outside network:**
- Verify DuckDNS is updating: visit https://www.duckdns.org and check your IP
- Check port forwarding is correct in router
- Verify server is running: `ps aux | grep server.py`
- Check firewall rules

**Server won't start:**
- Check if port is already in use: `lsof -i :8080`
- Try a different port in server.py
- Check logs for errors

**DuckDNS not updating:**
- Verify your token and domain in update_duckdns.sh
- Check /tmp/duckdns.log for error messages
- Manually run: `./update_duckdns.sh`

## Quick Reference

**Start server manually:**
```bash
python3 server.py
```

**Update DuckDNS manually:**
```bash
./update_duckdns.sh
```

**Check what's running on port 8080:**
```bash
lsof -i :8080
```

**Kill server process:**
```bash
pkill -f server.py
```
