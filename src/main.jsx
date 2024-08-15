import React from 'react'
import ReactDOM from 'react-dom/client'

import './stylesheets/root.css'
import './stylesheets/topbar.css'
import './stylesheets/index.css'  
import './stylesheets/projects.css'
import './stylesheets/resume.css'
import './stylesheets/login.css'
import './stylesheets/portal.css'
import './stylesheets/cyber.css'
import './stylesheets/resources.css'

import "../src/assets/fonts/stylesheet.css"

import Root from './routes/root.jsx'
import Index from './routes/index.jsx'
import ErrorPage from './routes/error.jsx'
import Portal from './routes/portal.jsx'
import Resume from './routes/resume.jsx'
import Resources from './routes/resources.jsx'
import Projects from './routes/projects.jsx'
import Cyber from './routes/cyber.jsx'
import Gaming from './routes/gaming.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/> ,
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true,
        element: <Index/>
      },
      {
        path: "/projects",
        element: <Projects/>
      },
      {
        path: "/cyber",
        element: <Cyber/>
      },
      {
        path: "/resume",
        element: <Resume/>
      },
      {
        path: "/resources",
        element: <Resources/>
      },
      {
        path: "/portal",
        element: <Portal/>
      },
    ]
  },
  {
    path: "/gaming",
    element: <Gaming/> ,
    errorElement: <ErrorPage/>,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <RouterProvider router={router}/>
  </React.StrictMode>,
)
