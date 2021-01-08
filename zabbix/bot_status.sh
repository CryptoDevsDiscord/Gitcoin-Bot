#! /bin/bash

# place into /boot_scripts/bot_status.sh

OUT=$(pgrep -ax node | awk '{print $(NF-1)" "$NF}')

if [[ "$OUT" != "node index.js" ]]; then
    echo 0
else
    echo 1
fi