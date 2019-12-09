# driver-pii
A [DataBox](https://www.databoxproject.uk) driver that displays data from a file (`src/pii/_piiINFO`).


# Data stored
This driver assumes that  PII file is in a container
and reads a PII file and displays the data to the user.

## Databox is funded by the following grants:

```
EP/N028260/1, Databox: Privacy-Aware Infrastructure for Managing Personal Data

EP/N028260/2, Databox: Privacy-Aware Infrastructure for Managing Personal Data

EP/N014243/1, Future Everyday Interaction with the Autonomous Internet of Things

EP/M001636/1, Privacy-by-Design: Building Accountability into the Internet of Things (IoTDatabox)

EP/M02315X/1, From Human Data to Personal Experience

```



Steps to create an app/driver

Running the databox 

Step 1 - Create a folder (ex- databox_dev)

Step 2 - Clone to the databox project using the following command into folder (databox_dev)
	 git clone https://github.com/me-box/databox.git

	Once cloned, make sure everything works fine and databox runs on your laptop

Step 3 - Run/Start the databox using the command
	docker run --rm -v /var/run/docker.sock:/var/run/docker.sock --network host -t databoxsystems/databox:0.5.2 /databox start -sslHostName $(hostname)

install apps from app store,
	run apps (ex- driver-os-monitor and app-os-monitor) and see if you could see the graphs when u click on app-os-monitor.


Step 4 - once everything works fine, Stop the databox using the command
	docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -t databoxsystems/databox:0.5.2 /databox stop

########################################################################################
Creating an app to say Hello
########################################################################################
Step 1 - Create a folder named "build" into the "databox_dev" folder copy paste the "app-pii" folder into it

Step 2 - open a terminal in databox_dev folder and execute the following command
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock --network host -t databoxsystems/databox:0.5.2 /databox start -sslHostName $(hostname)

Step 3 - Once databox is running, open another terminal in databox_dev and execute the following command
./databox-install-component app-pii databoxsystems 0.5.2

Step 4 - write http://127.0.0.1/ in a browser and enter the password (terminal 1 consists of a password)

Step 5 - goto app store, goto settings and browse the file (databox_dev/build/app-pii/databox-manifest.json) and add this file.

Step 6 - install the app-pii app

Step 7 - click on the app to run it.

Step 8 - tada, ur first app is running (now change things in main.js as per your requirements to display whatever you like).


Every time u make a change in the app-pii files, these following steps need to be followed to view the changes

Every time u change some files in ur app-folder
push it to git
uninstall the app from databox
Execute - ./databox-install-component app-pii databoxsystems 0.5.2
upload databox-manifest.json
install the app from app-store 
see the changes


