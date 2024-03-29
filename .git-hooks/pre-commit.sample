#!/bin/sh
RED="\033[1;31m"
GREEN="\033[1;32m"
NC="\033[0m"
linter_exit_code=1
all_ts_files=$(git diff --cached --diff-filter=d --name-only | grep .ts$)
all_scss_files=$(git diff --cached --diff-filter=d --name-only | grep .scss$)
./node_modules/.bin/eslint $all_ts_files --quiet --fix && ./node_modules/.bin/stylelint $all_scss_files --stdin --quiet --fix
linter_exit_code=$?
git add -f $all_ts_files $all_scss_files
if [ $linter_exit_code -ne 0 ]
then
  echo "${RED} ❌ Linter errors have occurred ( ͡ಥ ͜ʖ ͡ಥ)${NC}"
  exit 1
else
  echo "${GREEN} ✔ Eslint and Stylelint did not find any errors [̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]${NC}"
  exit 0
fi