# Atriis Task
# Angular + TypeScript + .NET Core

## location on github
https://github.com/daniel-wolfson/Atriis-angular-core-example.git

## About this Project

A sample project combining a variety of useful web development technologies 
originally shown to work together Angular.

## Solution "AtriisProducts" structure

- Frontend - Project "ProductClient" uses Angular, TypeScript, Bootstrap
- Backend - Project "ProductApi" uses Asp Net Core 3.1

## Frontend

- cd [RootDirectory]\ProductClient
- required once:
    - Windows install (Angular CLI requires a minimum nodejs version): 
    - https://nodejs.org/en/ => node-v16.13.2-x64.msi download => install
    - npm install -g npm
    - npm install -g npm@8.4.1
    - npm install -g @angular/cli@latest
- ng serve --open
- client by default working on http://localhost:4200 (if port 4200 already in use, select the other free port)
- client working with web api started on http://localhost:5000

## Backend

- ProductApi.sln is the entry point for "classic" editions of Visual Studio (Pro, Community, etc).
- ProductApi/ProductApi.csproj is a Web api (asp net core) project.

Warning! project is self web host contained service, 
and it starts as console application

#### Build and start ProductApi (asp net web api)
    (build occured from visual studio 2019)
- build solution
- start api:
    - cd [RootDirectory]\ProductApi\bin\Debug\netcoreapp3.1
    - AtriisProductApi.exe
    - app starting on http://localhost:5000
