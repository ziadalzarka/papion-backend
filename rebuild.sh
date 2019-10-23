#!/bin/bash
docker-compose down --rmi local
git pull
docker-compose up -d
