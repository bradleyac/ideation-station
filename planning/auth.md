This will be a distributed application requiring authentication/authorization as a cross-cutting concern.
  All microfrontends will participate in auth automatically
    How is this accomplished?
      * Could still just be easy auth?
      How are users registered?
  All microservices will require JWTs
    Simplified with API management?
  
  How are microfrontends brought together into one page?
    * Wrapper application that links to different sub-applications and that's it?
      The wrapper application/environment handles authentication and surfaces links to individual microfrontends
    OR package individual frontends into nuget/npm packages and load into an app shell.
      Requires frontends to all use same language/framework as the app shell.
        This is not ideal. I will want to make different frontends out of different frameworks for practice's sake. I want this to be something I can add on to for a long time, and I don't want to be stuck with Vue vs. React vs. Blazor for the whole thing.
    
Research: static site easy auth and microfrontend routes