#!/bin/bash

echo "Stopping Nginx..."

# Check if nginx is running
if pgrep nginx > /dev/null; then
    sudo nginx -s stop
    echo "Nginx stopped."
else
    echo "Nginx is not running."
fi
