Ideation Station is a multi-user space to create, organize and share ideas.

Design tenets:
  I should be able to actually show this off.
    This will be open to arbitrary users to sign up and use the service, or potentially to use it without signing up.
    It will be polished in its error-handling and security.
    It will have unit tests.
    It will be designed top-down, not bottom-up.
    It will use infrastructure as code everywhere.
  
  This will use Vue for the frontend, for learning.
    Or Svelte? Who am I doing this for, me or a job?

  This will be event-driven on the backend, for learning.

  Microservices and microfrontends, for learning and separation of concerns?
    Can break this up into a number of smaller projects that all contribute to a cohesive end-result
    -> Dapr? Does Dapr help with handling this sort of thing?

Questions:
  How do microservices share messages? 
  Is there a central message broker, or multiple published brokers? One per domain/bounded context?
  Where do consumers consume messages from? 
  How are messages consumed?

  If streams are published, and consumed by lots of consumers, how do the consumers get the message?
    Are consumers only registered "hosted apps"? Then they get access to messages from message queues directly?
    Outside consumers could be set up with an HTTP request based on a stream.

  Is this becoming IFTTT? Why would someone use this over IFTTT?
    * This has a focus more on projecting data from durable streams rather than responding to events from other applications.

  How are streams actually implemented? How much of this is actually feasible with the available technologies? Is it expensive to create one? How are they managed?
    Does one design constraint need to be that streams are lightweight and easy to create/extend?

Features:
  Login/auth/user account/user preferences
  Simple idea lists / streams?
  Stream generation via GenAI?
  Stream publishing/subscription
  Actions when elements are added to a stream?
    HTTP request
    AI task
  Notifications/reminders
  Scheduled addition of items to a stream
    e.g. every day at 9:00am send me the next item in the daily chore stream
    should be able to repeat e.g. weekly
  Stream templates?
    Every item in a stream is rendered a particular way? This would be good for e.g. a blog
      Could accept different types of media than text, or a mixture
      This would be a stream consumer "hosted app" or something--rendering a stream completely separate from authoring, exists as one of many   consumers of the stream data.
  Streams can feed into other streams, so a stream of text consumed by an AI task generating an image could emit the images into a new stream which is rendered as e.g. an image gallery
    