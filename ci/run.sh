#!/usr/bin/env bash
# 실패 시 로그 마지막 줄을 GitHub 주석(annotation)으로 남겨요.
LOG=$(mktemp)
"$@" > "$LOG" 2>&1
code=$?
cat "$LOG"
if [ $code -ne 0 ]; then
  MSG=$(tail -n 25 "$LOG" | sed 's/%/%25/g' | awk '{printf "%s%%0A", $0}' | cut -c1-3500)
  echo "::error title=FAILED: $*::$MSG"
  exit $code
fi
