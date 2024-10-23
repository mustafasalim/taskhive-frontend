import { RouterProvider } from "react-router-dom"
import router from "./routes"
import { ThemeProvider } from "./providers/theme-provider"
import ReactQueryProvider from "./providers/react-query-provider"

function App() {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        defaultTheme="light"
        storageKey="vite-ui-theme"
      >
        <RouterProvider router={router} />
      </ThemeProvider>
    </ReactQueryProvider>
  )
}

export default App
