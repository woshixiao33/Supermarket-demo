#!/bin/bash

cd "$(dirname "$0")/server" || exit 1
node index.js
