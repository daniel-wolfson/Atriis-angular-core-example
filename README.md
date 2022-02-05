# Atriis Task
# Angular + TypeScript + .NET Core

## location on github
https://github.com/daniel-wolfson/atriis_angular_core.git

## About this Project

A sample project combining a variety of useful web development technologies originally shown to work together React.
This app features:
- Angular
- TypeScript
- Bootstrap
- Asp Net Core 3.1

## Solution structure

Current RootDirectory: [[drive:\\projects]\atriis_angular_core]

- ProductApi.sln is the entry point for "classic" editions of Visual Studio (Pro, Community, etc).
- ProductApi/ProductApi.csproj is a Web api (asp net core) project.
- ProductApi.Tests/ProductApi.Tests.csproj is a unit test for web api project.
- Productlient - Angular client

## Set local angular environment by call cmd and install command:
- Windows install (Angular CLI requires a minimum nodejs version): https://nodejs.org/en/ => node-v16.13.2-x64.msi download => install
- CMD: npm install
- CMD: npm install -g @angular/cli@latest
- CMD: ng update
- CMD: npm cache clean --force (maybe required)



## Build and start ProductClient (Angular client)

- cd [RootDirectory]\ProductClient
- npm install
- ng serve --open
- client working on http://localhost:4200
- client working with web api started on http://localhost:5000

## Build and start ProductApi (asp net web api)

- build from visual studio (or visual studio code): build solution
- build from visual studio code: dotnet build .
- unit test (xUnit) api: start with visual studio unit test explorer
- start api:
    - cd [RootDirectory]\ProductApi\bin\Debug\netcoreapp3.1
    - ProductApi.exe
    - app starting on http://localhost:5000
