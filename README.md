# Tessel Data Server

Tessel Data Server is a basic data storage api for Tessel/IOT projects. It uses MongoDB to store JSON data. Currently implements:

GET  /api/weather Returns JSON array of collected weather data.
POST /api/weather Stores JSON data in Mongo and returns JSON result object.

**Note that there is no validation of data or enforcement of schema to keep things simple for now since this server is used for prototyping locally only.**

