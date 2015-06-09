#!/usr/bin/env sh

cd build
git init
git config user.name "Circle CI"
git config user.email hk.henrik+circle@gmail.com
git remote add origin git@github.com:Ineentho/blog.git
git checkout -b gh-pages
git add -A
git commit -m "CI Build"
git push -u origin gh-pages -f