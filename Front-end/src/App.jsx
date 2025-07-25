import { RouterProvider } from "react-router-dom"
import { Routers } from "./Routes"
import { Toaster } from '@/components/ui/sonner';



function App() {

  return (
    <>
<RouterProvider router={Routers}/>
<Toaster/>
    </>
  )
}

export default App
