#!/bin/bash
# Update & install required packages
sudo apt update && sudo apt install -y apache2 openssl git

# Create directory for SSL cert
sudo mkdir -p /etc/apache2/ssl

# Generate a self-signed SSL certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/apache2/ssl/apache-selfsigned.key \
  -out /etc/apache2/ssl/apache-selfsigned.crt \
  -subj "/C=AU/ST=NSW/L=Sydney/O=Student/CN=18.139.115.202"

# Enable Apache SSL and site config
sudo a2enmod ssl
sudo a2ensite default-ssl
sudo systemctl restart apache2

# Clone project from GitHub and deploy
cd /var/www/html
sudo rm -rf *
sudo git clone https://github.com/yasirarafat100/CharityDonation.git .
sudo chmod -R 755 /var/www/html

# Confirm deployment
echo "Deployment Complete: Visit https://18.139.115.202"
