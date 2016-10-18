"use strict";

 angular.module("matchminer-configuration", [])

.constant("ENV", {
  "name": "development",
  "endpoint": "http://localhost:8080",
  "apiEndpoint": "http://localhost:8080/api"
})

;