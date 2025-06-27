import { Toaster } from "react-hot-toast";
import { AppProviders } from "./providers";
import { AppRouter } from "./router";

function App() {
  return (
    <AppProviders>
      <Toaster/>
      <AppRouter/>
    </AppProviders>
  )
}

export default App
