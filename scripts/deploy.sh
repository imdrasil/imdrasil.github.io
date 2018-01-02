 ruby scripts/build.rb &&
   git add . &&
   git commit -m"Automatic deploy for $(date -I'seconds')." &&
   git push origin HEAD