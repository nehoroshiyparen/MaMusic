import { Toaster } from "react-hot-toast";
import { AppProviders } from "./providers/providers";
import { AppRouter } from "./AppRouter";
import SessionGate from "./gates/session.gate";

function App() {
  return (
    <AppProviders>
      <SessionGate>
          <Toaster/>
          <AppRouter/>
      </SessionGate>
    </AppProviders>
  )
}

export default App
