# driver-reddit-simulator
A [DataBox](https://www.databoxproject.uk) driver that loads existing reddit data from a file (`src/reddit-data/$user-id`) and stores it into a Databox datastore.


# Data stored
This driver writes transactional event data into a store-json for later processing.

It saves the following streams of data:

- `redditSimulatorData`: Reddit Data in Json format

These can then be accessed store-json API.


## Databox is funded by the following grants:

```
EP/N028260/1, Databox: Privacy-Aware Infrastructure for Managing Personal Data

EP/N028260/2, Databox: Privacy-Aware Infrastructure for Managing Personal Data

EP/N014243/1, Future Everyday Interaction with the Autonomous Internet of Things

EP/M001636/1, Privacy-by-Design: Building Accountability into the Internet of Things (IoTDatabox)

EP/M02315X/1, From Human Data to Personal Experience

```
