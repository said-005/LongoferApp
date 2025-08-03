import { RouterProvider } from "react-router-dom"
import { Routers } from "./Routes"
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from './components/theme-provider';



function App() {

  return (
    <>
    <ThemeProvider>
<RouterProvider router={Routers}  basename="/back-end/public"/>

    </ThemeProvider>

<Toaster/>
    </>
  )
}

export default App
