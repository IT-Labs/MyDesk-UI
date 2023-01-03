# inOffice - SPA

## Table of contents

- [Introduction](#introduction)
- [Accessing the application](#accessing-the-application)
- [Setup](#setup)
- [Component documentation](#component-documentation)
- [How to contribute to the project](#how-to-contribute-to-the-project)

## Introduction

InOffice is a desk reservation application designed to help users reserve any desk of their choice ahead of time so there aren't any clashes between collegues. The idea for the inOffice application has arisen in the period of pandemic crisis. This hybrid work model’s aim was to modify or re-design the office work environment to promote social distancing in compliance with COVID-19 pandemic protocols. But this type of working model will be more indispensable even if the pandemic ends. One of the main objectives is to maintain less office space that leads to company cost optimization. No more idle working desks or conference rooms.
This application is front-end part of inOffice project. The back-end part of this project can be found on this [link](https://dev.azure.com/ITLabs-LLC/Internship%202022/_git/inOffice%20-%20.NET).

## Accessing the application

The way to access the front is by setting up the backend with .NET, creating an Azure Enterprise application. And placing the neccessery information in a .env file.

- **REACT_APP_API_URL**: The URL for the api that we need for all of our requests.

- **REACT_APP_TENANT_ID and REACT_APP_CLIENT_ID**: The tentant id and are what we get from our Azure enterprise details to access the Microsoft SSO and have access to the Graph API

- **REACT_APP_GOOGLE_CLIENT_ID**: Google client id is used to get details from our Google account to access the Google SSO and have access to login with google account from some external users.

- **REACT_APP_URL**: The most basic of all, where the application is currently being hosted. It can either be localhost:3000 per default or if you have a personal domain setup and are hosting it, although I will recommend you have a .env.production and .env.development just so there are no errors via development and production environments.

Make sure your users have the neccessary roles so they have access to the application. You can setup those roles in the Azure Portal.

## Setup

To start the application, make sure you have Node.js and npm installed on your system, then type in the terminal **npm install** and then **npm start**.

## Component documentation

The way we can access the component documentation is with Storybook, which isolates our components so we can test them and add comments on what that specific component does. To run, just type in **npm run storybook**

## How to contribute to the project

- Fork this repository
- Clone your forked repository
- Add your changes
- Commit and push
- Create a pull request
- Star this repository
- Wait for pull request to merge
