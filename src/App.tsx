import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { PatientProvider } from "./app/pages/PatientContext";

function App() {
  return (
    // ✅ WRAPPER DENGAN SAFE AREA PADDING
    <div 
      className="min-h-screen"
      style={{ 
        paddingTop: 'env(safe-area-inset-top, 20px)',
        minHeight: '100vh'
      }}
    >
      <PatientProvider>
        <RouterProvider router={router} />
      </PatientProvider>
    </div>
  );
}

export default App;