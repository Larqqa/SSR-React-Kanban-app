# Kanban App

Kanban style app made with React and Express. The Client is also made with SSR capabilities which are mostly used for routing purposes.

## What
The app is mainly for simple task based project management. A user can create a project, add tasks to the project and share read & write permits to other users based on username. The project tasks are split into columns, like in a kanban style board. The columns are: To do, In progress, Done. A task can be given a completion time as days and hours. These start at the creation of the task.
## Why
This application is mostly used as practice. I wanted to practice using WebPack, creating SSR React apps, and creating fullstack Express and React apps. I also wanted to create a better tool than pen & paper for managing my time and tasks when im programming, or doing other things that require task management. This tool is also going to be used for that purpose once finished.
## How
The application uses an Express server as the backend and React app as the frontend. The server also renders the initial views of the Client, so that the React client can use "nice" urls 😄 (also user gets some view with "loading" message faster). The server works as a REST API, so every action is done as HTTP requests. The React client uses Redux for most of the state management and Axios for the HTTP requests. User authentication is handled with 24 hour Json Web Tokens, that are saved on the browsers local storage for persistent logins.
## WIP
* History of finished tasks
* History of finished projects
* Cookie alert popup?
* Styling of the whole app
* Commenting / Messaging for individual tasks
* User roles in projects
* User page & full CRUD functions for users 
* Form sanitization before release v1
* Error & Message handling
* Unit & Integration Tests
* E2E Tests