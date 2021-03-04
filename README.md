# Ticketing-App-MicroS

# auth

- $npm i typescript ts-node-dev express @types/express

make a tsc config file by ($tsc --init)

- ($docker build -t diabmotasem/auth .) to ensure that Dockerfile is ok

- in root ($skaffold dev) to ensure that tha skaffold file and kubernetes file are ok
  if any error rerun the command

- make ingress nginx service ...
- change the hosting on mac in (/etc/hosts) or (C:\Windows\System32\Driver\etc\hosts) in windows
- if any security issue appears type (thisisunsafe) anywhere inside the browser

- we will use (express-validator) to validate the requests
- we will write an error handling middleware in a consistent structure and back it to browser in one fashin type of error
- make a new classes for each error (with abstract class) to enforce error classes to implement some methods in our way

- we will use a package called (express-async-errors) it is used if we want to thrown an error inside async function

############################### -8- ###############################

- install mongoose in auth dir
- create (/inra/k8s/auth-mongo-depl.yaml)
- know we will loose our data in DB pod if restarted

############################### -9- ###############################

- Mostly we will user JWT inside Cookie to solve the issue of server side rendering in react then the React will talk to other services.
- we will use (cookie-session) library
- we will use (jsonwebtoken) library

- for create a general secret ($kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf)
it creates an actual object, to list all secrets ($k get secrets)
  edit deployment config file as seen
- or we can make a config file for that secret

- ($k describe pod <podName>) to descripe what is happening

############################### -10- ############################### Testing

- we will use (supertest) libraty to make a fake request to express
- we will use (jest) library to make tests

# ($npm i --save-dev @types/jest @types/supertest jest ts-jest supertest mongodb-memory-server)

- refactor code, install dep, make setup.ts file.
- make **test** dir inside route, then make the file you want to make test inside it

############################### -11- ############################### Server side rendering

- normally the browser request html then another request for JS then may needs some data then make another request
- in Server Side Rendering we only make one request to (Next JS) it will do all the work that returns fully rendered HTML file with content.
- It is faster, especially for Mobile that may not run JS fast or so, will be a faster search engin

for Client Application ($npm i react react-dom next)

- after modify the script in package.json ($npm run dev) "the files inside the page dir" are like a routes we can access it form the url after run the client

- maka a docker file, build it, push it,
- make a depl file,
- edit skaffold.yaml file and ingress-srv

- make (next.config.js) file to make next watch the changes

- we will refactor the code in (hook) dir

---------------------------------------------------------------------------------
# Big issue (Error) for server side rendering when call axios in (LandingPage.getInitialProps) says we cant access localhost:80 (Error: connect ECONNREFUSED). when we make another request from inside the cluster (on server)
it works if we make the request inside LandingPage function "it's in the browser" so we have to made some configuration.
In case of request to "/api/users/currentuser" from the browser, the (my computer) networking layer will add "https://ticketing.dev:80" as a prefix for the url, then make the request as normal to ingress-nginx, so this will return the data. as shown in figure 
    But in case we request to this url on the server as we want to do inside (LandingPage.getInitialProps), the kubernetes networking layer will add (https://localhost:80) as prefix to the url but we are in different world !!!! we are realy inside the cluster 
- Solution #2: we have to tell that if we made the request from the browser then do your work, if the request is on the server then make the prefix to service url (https://auth-srv) then made the request (you was in the server) but if we want to make a request to another service, does we have to change the prefix ??
- Solution #1: the request go to Ingress then it will decide the prefix based on the path then made the request. Note: we have to extract the cookie from the coming request to client and put it in the new request to Ingress for rendering some data

NameSpace problem ($k get namespace): we can access another srv by type its url (auth-srv) but this works if we will be inside the same nameSpace (solution #2), but if we want to reach Ingress from cluster "solution #1" (it's in another name space) the url will be "http://NAMEOFSERVICE(ingress, get it as below).NAMESPACE.svc.cluster.local"
- to get all services running inside a name space ($k get services -n NAMESPACE)
- so you may use (http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser) to reach it from (server), or use External name space that will map this



############################### -12- ############################### Code sharing and Reuse

- we will made a shared library to use anything related by doing import not writing the code
- Custom Error
- Auth Middleware
- Request validation Middleware

- make a dir named common, npm init -y, make some changes in it.
- to publish the package you have to push it firstly to Git ($git init),($git add .),($git commit -m "initial commit")
- ($npm login)($npm publish --access public)
- even if we write in TS we will push "publish" the JS
 - TS init: ($tsc --init), ($npm i typescript del-cli --save-dev) then make src dir
 - modify tsconfig.json (13,17"add build")
 - add (.gitignore) file
 - ($npm run build)
 - for any change: ($git status), ($git add .), ($git commit -m "message"), ($npm version patch||or other ), ($npm run build), ($npm publish) or make a new script.
 - do like in index.ts
 - install the module in your service, import what you want

 - for any change in common lib: (like what we made before), in auth Service ($npm update @e-commerce-social-media/common)


 ############################### -13- ############################### Tickets Service
 - we will use TTD approach
 

############################### -14- ############################### NATS streaming server (Event-Bus)

- NATS (is a simple event-bus) but we will use "NATS Streaming Server" it is on top of NATS
- See the documintation on docker hub about Commandline options and NATS SS on official site

- Create "nats-depl.yaml", we will use it in small project 

-------------------------------------------------------------------------------------------------
- We will make a small independent project for nats-streaming
- start the project, install depend.s , write some scripts, make it for TS,
- write the files ..... 
- make the natsSS listening to port by any option in slides file, we will use option #3
- (#3): ($k get pods), ($k port-forward NATS_POD_NAME 4222:4222), in another tab ($npm run publish)

- we send the data to NATS server with channel want to reach, the server sends that data to all services subscribed to this channel

- the client can not listen two times (cant run the process "client" twice) because the NATS register the client who connected to listen if the id is hard coded, we can solve this problem if we put the id as random generated

- if we made two copies of a service and send an event, both will handle the event, this may cause a replicas (getting the same comment twice), to solve this we made a ((((( Queue group ))))) this will be inside the channel ( will send the event to randomly to one servise)

- we will do the same (#3) for port 8222 for monitoring, then in http://localhost:8222/streaming you can see many different information (video 273.)

- problem of concurrency (deposite, deposite"lage", withdraw"will fail"), many solutions (look at slides)
-------------------------------------------------------------------------------------------------


############################### -16- ###############################

we will make a fake clientWrapper to make the tests pass (__mocks__) and modify the test uses NATS client (new.test.ts)