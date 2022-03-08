#!/bin/bash
echo -e "[Unit]\n
Description=Kuzzle Service\n
After=docker.service\n
Requires=docker.service\n
[Service]\n
Type=simple\n
WorkingDirectory=/d/tracking/kuzzle\n
ExecStart= -f /d/tracking/./kuzzle/docker-compose.yml up\n
ExecStop= -f /d/tracking/./kuzzle/docker-compose.yml stop\n
Restart=on-abort\n
[Install]\n
WantedBy=multi-user.target" > /etc/systemd/system/kuzzle.service
systemctl enable kuzzle
