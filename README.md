# stream-auth

A simple authorization system for a streaming service. 

## What is stream-auth

stream-auth is short for stream authorization; although the name auth may seem misleading, this service provides some level of authorization for streaming platforms. Most services may start simple but grow to be much more; hence this service is built with that notion in mind.

## Assumptions

1. Some other services would do actual Authentication and Authorization.

2. The requesting client has already been authorised and authenticated to use the platform and consume this API.

3. The requesting client, after authorization and authentication, has access to the following data:

    a. user_id - Some unique identifier for a user of the system.

    b. device_id - A unique identifier, identifying which device is accessing the API. This may be a bit tricky since this service may be called by another service. In which case the calling service(client) should have obtained this information from the webapp, mobile app etc. 

**NB//:**

4. If a user_id has more than three device_id's associated with it at any given time the user would not be granted access.

5. The entire API would be built around the concept of users, this servie would however not be doing user management.

6. Each time a user logs into a new device this service is called, if the service can not create a user object and return a stream_auth token within the session then the requesting client should not stream the video.


## Initial Project Setup

It is assumed that you are familiar with docker and have docker setup on your development machine.  
In case you have not done this, or are unfamilair with docker,  
kindly visit [docker getting started](https://docs.docker.com/get-started/)

Once done setting up docker, clone the code.  
Navigate to the stream-auth directory.  
In case you don't know how to get this done speak to someone on the project who can help.


## To build and start an instance of the server for the first time:

NB// Change the `example.env` file to `.env` and fill in the fields appropraitely

1. > $ docker compose up -d
2. > $ docker-compose exec node /bin/sh
3. > $ npm run dev

Server is accessible at [http://localhost:3000/](http://localhost:3000/)

## To create a mongo user 

1. > $ docker compose up -d
2. > $ docker-compose exec node /bin/sh


Known Issue:

* When using docker on windows it may be a bit slow, [this](https://www.createit.com/blog/make-docker-on-windows-fast-again-2022/) should help.

* Sometimes after building the container `nodemod` will not be installed, in that case run `npm install` in the root directory o the project.