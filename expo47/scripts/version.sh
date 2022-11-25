#!/bin/bash
set -euo pipefail
echo "export default {"
echo "  \"timestamp\": `date +%s`,"
echo "  \"date\": \"`date -R`\","
echo "  \"hash\": \"`git describe --always --tags --dirty`\""
echo "}"
