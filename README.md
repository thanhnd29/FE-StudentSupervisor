# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Description:

-   Currently, managing and reporting student violations in high schools is very difficult. The traditional recording and reporting process is not only time-consuming but also prone to errors. In addition, there is no centralized platform to manage information related to violations, attendance, and compliance activities, making monitoring and handling violations fragmented and ineffective.
-   To overcome these disadvantages, our team decided to develop a modern and easy-to-use platform that helps high schools manage students and handle violations more effectively. This platform will provide tools to record, report and analyze violation data, helping teachers and administrators grasp the situation accurately and quickly.

### Feature:

### `Dev Test`

1. First, clone the backend repository from [here](https://github.com/ThanhTruong3108/Student-Supervisor-Application).

2. Make sure to make necessary adjustments in the backend to match your local environment:

    - Update the user and password in the database connection settings.
    - Update the database connection settings (user and password) in the local deployment configuration of the backend.

3. Then, press F5 to run the backend server.

Go to `.env` change `VITE_API_URL` = `Url Backend Deploy local`

1. Install necessary libraries by running the command:

```sh
    yarn
```

2. To run the development server, use the command:

```sh
    yarn dev
```

Alternatively, if you want to build the project and then start the server, execute the following commands:

```sh
    yarn build
    yarn start
```

Now, you can test and develop the project locally on your machine.
