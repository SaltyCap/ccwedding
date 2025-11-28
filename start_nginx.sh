#!/bin/bash

# Get the absolute path of the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Starting Nginx..."
echo "Config: $DIR/nginx.conf"
echo "Root: $DIR"

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "Error: nginx is not installed. Please run 'brew install nginx' first."
    exit 1
fi

# Run nginx with the custom config
# We use sudo because we are binding to port 80
sudo nginx -p "$DIR/" -c "$DIR/nginx.conf"

if [ $? -eq 0 ]; then
    echo "Nginx started successfully on http://localhost"
else
    echo "Failed to start Nginx."
fi
