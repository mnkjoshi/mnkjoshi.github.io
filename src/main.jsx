import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import "../src/assets/fonts/stylesheet.css"
import Root from './routes/root.jsx'
import Index from './routes/index.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/> ,
    // errorElement: <ErrorPage/>
  },
  // {
  //   path: "/dashboard",
  //   element: <Dashboard/>,
  //   children: [
  //       {
  //         index: true,
  //         element: <Index/>
  //       },
  //       {
  //         path: "/dashboard/report",
  //         element: <Report/>
  //       },
  //       {
  //         path: "/dashboard/track",
  //         element: <Track/>
  //       },
  //       {
  //         path: "/dashboard/analytics",
  //         element: <Analytics/>
  //       },
  //   ]
  // }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <RouterProvider router={router}/>
  </React.StrictMode>,
)
