#!/bin/bash
# Raspberry Pi Captive Portal Setup Script
# Compatible with: Pi Zero W, Pi Zero 2 W, Pi 3, Pi 4, Pi 5
# This script sets up a WiFi access point with captive portal for the wedding website

set -e

echo "================================================"
echo "Wedding Seating Chart - Pi Captive Portal Setup"
echo "================================================"
echo ""

# Detect Pi model
PI_MODEL=$(cat /proc/device-tree/model 2>/dev/null || echo "Unknown")
echo "Detected: $PI_MODEL"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (use sudo)"
    exit 1
fi

# Configuration
SSID="Christian-Chloe-Wedding"
CHANNEL=6
INTERFACE="wlan0"

echo "Installing required packages..."
apt-get update
apt-get install -y hostapd dnsmasq python3 iptables-persistent

# Stop services while configuring
systemctl stop hostapd
systemctl stop dnsmasq

echo "Configuring static IP for wlan0..."
cat > /etc/dhcpcd.conf.d/wlan0.conf << EOF
interface wlan0
    static ip_address=10.0.0.1/24
    nohook wpa_supplicant
EOF

echo "Configuring hostapd (WiFi Access Point)..."
cat > /etc/hostapd/hostapd.conf << EOF
# WiFi Interface
interface=wlan0

# Driver
driver=nl80211

# WiFi Configuration
ssid=$SSID
hw_mode=g
channel=$CHANNEL
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0

# No encryption (open network)
wpa=0
EOF

# Point hostapd to config file
cat > /etc/default/hostapd << EOF
DAEMON_CONF="/etc/hostapd/hostapd.conf"
EOF

echo "Configuring dnsmasq (DHCP + DNS)..."
# Backup original config
mv /etc/dnsmasq.conf /etc/dnsmasq.conf.backup 2>/dev/null || true

cat > /etc/dnsmasq.conf << EOF
# Interface to listen on
interface=wlan0

# DHCP range
dhcp-range=10.0.0.10,10.0.0.250,255.255.255.0,24h

# DNS - redirect all requests to this Pi
address=/#/10.0.0.1

# Don't read /etc/resolv.conf or /etc/hosts
no-resolv
no-hosts

# Log queries for debugging
log-queries
log-facility=/var/log/dnsmasq.log
EOF

echo "Configuring iptables (traffic routing)..."
# Enable IP forwarding
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
sysctl -p

# Flush existing rules
iptables -F
iptables -t nat -F

# Redirect all HTTP traffic to local web server
iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80 -j DNAT --to-destination 10.0.0.1:8080
iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 443 -j DNAT --to-destination 10.0.0.1:8080

# Masquerade (NAT) for internet access (optional, if you want to share internet)
# iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Save iptables rules
netfilter-persistent save

echo "Creating systemd service for wedding website..."
cat > /etc/systemd/system/wedding-website.service << EOF
[Unit]
Description=Wedding Seating Chart Website
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/wedding
ExecStart=/usr/bin/python3 /home/pi/wedding/server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo "Enabling services..."
systemctl unmask hostapd
systemctl enable hostapd
systemctl enable dnsmasq
systemctl enable wedding-website

echo ""
echo "================================================"
echo "Setup Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Copy your wedding website files to /home/pi/wedding/"
echo "2. Reboot the Pi: sudo reboot"
echo "3. Connect to WiFi network: $SSID"
echo "4. Open any browser - you'll be redirected to the seating chart!"
echo ""
echo "To view logs:"
echo "  - hostapd: sudo journalctl -u hostapd -f"
echo "  - dnsmasq: sudo tail -f /var/log/dnsmasq.log"
echo "  - website: sudo journalctl -u wedding-website -f"
echo ""
