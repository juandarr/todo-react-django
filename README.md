# JoyFlow
A task manager app, with statistics and a pomodoro timer (pending feature)

The main purpose of this app is to help you organize and manage your personal projects in list, tasks and define how you are going to manage your time during the day.

![Overview of Todo app](./images/todo-overview.png)

## Stack

- React
- Typescript
- TailwindCSS
- Django
- SQL

## Features

- Create tasks. The concept of task/todo is used to represent something that you will do eventually which has at least a definition, purpose or topic (title). Tasks have the following properties:
  - Title
  - Description
    - An optional description of the task
  - Completed
    - Represents whether the task has been completed or not
  - Due date
    - A past/present/future date at which the task is suppose to be completed
  - Priority
    - Priorities give a definition of how important is the task being created. It has four option from least to most important: none, low, medium, high
  - List 
    - Tasks are associated to list. When no list is assigned it will be associated to the inbox list by default
- Create lists. Lists can represent a project, a list of tasks for the day or anything you want.Lists have the following properties:
  - Title
- Tasks created from the navigation bar can be associated to any current List. If no list is defined it will be associated to the default list for the current user(inbox)
- Tasks created from the task view only allow to define title and are associated to inbox by default
- Keyboard shortcuts
  - `s`: hide or show the sidebar
  - `q`: open the task creation modal from the navigation bar 
  - `h`: show the list defined as home list in the task view

## Identity
The app name is JoyFlow. The goal is to create a system the user will enjoy using as  a companion while facing the challenges brought by the day. The user inferface is designed to be playful, clean and minimalistic. The flow part of the name is aspirational: the intention is for the system to help the user to induce and keep a state of flow while working on a project or mission.

### Base colors
The hue `600` as defined by the TailwindCSS system.

- Violet: `rgb(124,58,237)` (`violet-600`)
- Cyan:`rgb(2, 132,199)` (`cyan-600`)
- Fuchsia:`rgb(192,38,211)` (`fuchsia-600`)
- Red: `rgb(244,63,94)` (`rose-600`)
- Green:`rgb(5,150,105)` (`emerald-600`)
- Yellow:`rgb(217,119,6)` (`amber-600`)

The overal background of the app is `rbg(56,189,248)` (`sky-400`). The background of component is `white`. For input elements such TextArea, input or TextEditor the background is `rgb(17,24,39)` (`gray-900`).

# License

Pending...
