# JoyFlow

A task manager app with lists, day to day task tracking and other useful features to organize your day.

This application is designed to help you organize and manage your personal projects and time. It provides tools to manage your time during the day by criteria such as priority, due date/time and completion. It also includes drag and drop to define the location of lists in the lists sidebar and tasks in the task view.

![Overview of Todo app](./images/todo-overview.png)

## Improvements

- [ ] Validate state management and storage procedure when the app goes offline or internet connection is lost. Find a way to manage state and have a unique source of truth. An alternative is to set the app only for online usage.
- [x] Have a field to mark tasks set for all day instead of just defining it with a time (12AM as of right now). In progress.
- [x] When the viewport width is below `md`, hide sidebar/menu when clicking in sidebar button. Change its icon and visual guidance.

## Planned features

- [ ] Notifications
- [ ] Pomodoro style timer for tasks

## Stack

- React
- Typescript
- TailwindCSS
- Django
- SQL

## Features

- Tasks: The concept of task/todo is used to represent an action to be taken with at least a title. Tasks have the following properties:
  - Title
  - Description
    - An optional description of the task. May be used for note taking, the limit is about 1000 characters. Supports markdown for substaks, headers (h1, h2, h3 and h4), bullet points and more.
  - Completed
    - Represents whether the task has been completed or not. False when created, becomes true upon completion.
  - Due date
    - A past/present/future date at which the task is suppose to be completed
  - Priority
    - Priorities give a definition of how important is the task being created. It has four option from least to most important: none, low, medium, high
  - List
    - Tasks are associated to list. When no list is assigned to a task, it will be associated to the inbox list by default
- Lists: can represent a project, a collection of things to do during the day or anything you want.
  - Lists have the following fields:
    - Title
  - Lists can be archived when you want to preserve the data and history
- Tasks created from the top navigation bar (`+` icon) can be associated to any active List. If no list is defined it will be associated to the default list for the current user (inbox)
- Tasks created from the task view only require the title and will be associated to current list in view
- Keyboard shortcuts
  - `s`: hide or show the sidebar
  - `q`: open the task creation modal from the navigation bar
  - `h`: show the list defined as home list in the task view

## Development

Here are the instructions to run the application and start developing with hot reloading:

- Clone the repository in the location you choose.
- Install a Python environment using `miniconda` or `uv`. If using `minicoda`, install `pip` with `conda install pip` and proceed to the python dependency installation with `pip install -r requirements.txt`
- Create `database` folder, add a previous existing database or create the database from scratch using `python manage.py migrate` on root folder.
- Install `node`, the proceed to install every dependency by going to `jstoolchains` and running `npm install`
- [Create API](https://www.saaspegasus.com/guides/modern-javascript-for-django-developers/apis/) from specification in file `schema.yml`.
  - Make sure you install the `openapi generator cli`: `npm install @openapitools/openapi-generator-cli`. This package will allow you to create the API via `schema.yml`, located at the root of the project.
  - Once you have it installed, go to the folder `jstoolchains` and run: `npx @openapitools/openapi-generator-cli generate -i ../schema.yml -g typescript-fetch -o ../todo-api-client/`
- Bring `.env` file with custom credentials to use Gmail SMTP server
- Modify API call in the `jstoolchains` folder (go to `src\lib\api.ts`), make sure the call is to `127.0.0.1:8000`
- Run the python server using `127.0.0.1:8000` if using Linux. `0.0.0.0:8000` is required if making the call from `WSL2`.
- Run tailwind watch in a separate terminal by going to `jstoolchains` and running `npm run tailwind-watch`.
- Run webpack by opening a separate terminal, `cd jstoolchains` and running `npm run dev`
- Now go to the server address, you should be ready to start development!

### Running after setup

Once the initial setup is completed, generally you just need the following three commands (one per terminal session) to work on development mode:

- Run the python server from root with `python manage.py runserver 127.0.0.1:8000`. `0.0.0.0:8000` if using `WSL2`
- Run tailwind watch from `jstoolchains` folder with `npm run tailwind-watch`
- Run webpack from `jstoolchains` folder with `npm run dev`

### Database migrations

When doing a modification to the database you can use the `migration` tool from Django to propagate your changes in your models to your database schema. Here are the common steps (for more information refer to [Migrations Django documentation](https://docs.djangoproject.com/en/5.1/topics/migrations/)):

- `python manage.py makemigrations`, and after
- `python manage.py migrate`

You also need to get a new `schema.yml` file, since the structure was changed. Make sure you have installed `drf-spectacular` with `pip install drf-spectacular` and run the following command:

- `python manage.py spectacular --file schema.yml` at the root of the project

> Temporary workaround
> Once you get the new file, make sure that the schema for List and Todo only have `title` as required field

Once you have your `schema.yml` file set, you can create your own API using `openapitools` according to the instruction at the beginning of the `development` section.

### Performance diagnostics

#### Webpack

There is plugin included in the repo aimed to detect which modules are the ones taken most of the space in runtime, as part of the main app or from third party vendors. The module in question is `webpack-bundle-analyzer`, and can be enable while running `npm run dev/build` by using the prefix flag `ANALYZER=true` as follows:

```js
ANALYZER=true npm run build
```

## Design

The app name is JoyFlow. The goal is to create a system the user will enjoy using as a companion while facing the challenges brought by the day. The user inferface is designed to be playful, clean and minimalistic. The flow part of the name is aspirational: the intention is for the system to help the user to induce and keep a state of flow while working on a project or mission.

### Color palette

The hue `600` as defined by the TailwindCSS system.

- Violet: `rgb(124,58,237)` (`violet-600`)
- Cyan:`rgb(2, 132,199)` (`cyan-600`)
- Fuchsia:`rgb(192,38,211)` (`fuchsia-600`)
- Red: `rgb(244,63,94)` (`rose-600`)
- Green:`rgb(5,150,105)` (`emerald-600`)
- Yellow:`rgb(217,119,6)` (`amber-600`)

The overal background of the app is `rbg(56,189,248)` (`sky-400`). The background of component is `white`. For input elements such TextArea, input or TextEditor the background is `rgb(17,24,39)` (`gray-900`).

# License

Pending
