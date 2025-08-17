#!/bin/bash

# Setup automated SSL certificate renewal with cron

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROTATE_SCRIPT="$SCRIPT_DIR/rotate-ssl.sh"
CRON_LOG_DIR="/var/log/ssl-rotation"
CRON_LOG_FILE="$CRON_LOG_DIR/rotation.log"

# Create log directory
mkdir -p "$CRON_LOG_DIR"

# Function to add cron job
add_cron_job() {
    local schedule="$1"
    local command="$2"
    
    # Check if cron job already exists
    if crontab -l 2>/dev/null | grep -q "$command"; then
        echo "Cron job already exists"
        return 0
    fi
    
    # Add new cron job
    (crontab -l 2>/dev/null; echo "$schedule $command") | crontab -
    echo "Cron job added successfully"
}

# Setup daily check at 2 AM
CRON_SCHEDULE="0 2 * * *"
CRON_COMMAND="$ROTATE_SCRIPT --check >> $CRON_LOG_FILE 2>&1"

echo "Setting up automated SSL certificate check..."
add_cron_job "$CRON_SCHEDULE" "$CRON_COMMAND"

# Setup monthly forced rotation on the 1st at 3 AM (optional)
# Uncomment if you want forced monthly rotation
# MONTHLY_SCHEDULE="0 3 1 * *"
# MONTHLY_COMMAND="$ROTATE_SCRIPT --force >> $CRON_LOG_FILE 2>&1"
# add_cron_job "$MONTHLY_SCHEDULE" "$MONTHLY_COMMAND"

echo "Current cron jobs:"
crontab -l 2>/dev/null | grep rotate-ssl

echo ""
echo "To view logs: tail -f $CRON_LOG_FILE"
echo "To remove cron job: crontab -e (and delete the line)"
echo "To list cron jobs: crontab -l"