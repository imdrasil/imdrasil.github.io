 bundle exec ruby scripts/build.rb ${$1:-all} &&
   git add . &&
   git commit -m"Automatic deploy for $(date -I'seconds')." &&
   git push origin HEAD
