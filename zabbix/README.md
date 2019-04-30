# zabbix

Scripts and zabbix templates to monitor the bot. This assumes a valid installation of Zabbix

# Installation

* Copy the `userparameter_bot.conf` to `/etc/zabbix/zabbix.agent.d` of the host running the bot and restart the zabbix-agent service
* Import the zabbix template
* Add the template to the desired host running the bot service