#!/bin/sh
# run.sh

# Run the bot and loop if the bot closes
while true; do
	node src/main --color
	sleep .25
done
