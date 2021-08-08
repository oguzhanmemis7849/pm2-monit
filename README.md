# Pm2-Monit Project


PM2 monit project shows the information of the running processes. It can restart these processes, delete them, and show their outputs and errors.

For this project NodeJS, Express, Angular CLI 12.1.1 are used. Pm2 version used is 1.0.4
Real-time data flow is made with websocket between backend and frontend.

## Content
The project has 3 pages. Overview, Issues and Charts.
* Overview :

You can access Processes Id, Name, Status, CPU and Memory Usage, Computer name, Unique Id, Created at, Uptime and Restart Count 
information. You can restart these processes with the restart button, check their output with the out logs button and 
delete the processes with the delete button.

* Issues : 

In this section, you can instantly see the errors by selecting the active processes according to their names.

* Charts :

In this section, by selecting the active processes according to their names, you can monitor the CPU consumption and memory usage graphically.

## Backend
For the backend, open a new terminal and enter the backend file from the console as cd Backend.

`npm install`  
`npm run start`  

Save the processes you will create or use in the backend with the name .js. For example, you can open a process called api.js by opening a terminal in the backend. Then start as

`pm2 start api.js` 

## Frontend
For the frontend, open a new terminal and enter the frontend file from the console as cd Frontend/Angular12Crud.

`npm install` 
`npm run start` and go to the [http://localhost:4200/](http://localhost:4200/) 

## Test
This project uses mocha test framework.
GET, POST, DELETE operations are tested.

You can test with `npm test`. 

![Test](https://github.com/oguzhanmemis7849/pm2-monit/blob/master/images/test.PNG)


### Creators
Oğuzhan Memiş
