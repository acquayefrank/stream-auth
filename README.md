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