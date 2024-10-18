import { RouterProvider } from "react-router-dom"
import router from "./routes"
import { ThemeProvider } from "./providers/theme-provider"
import ReactQueryProvider from "./providers/react-query-provider"
import ModalProvider from "./providers/modal-provider"

function App() {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        defaultTheme="dark"
        storageKey="vite-ui-theme"
      >
        <ModalProvider />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ReactQueryProvider>
  )
}

export default App
