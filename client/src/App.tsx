import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import EditorPage from './Pages/EditorPage';
import LoginPage from './Pages/LoginPage';

function App() {
  return (
    <div>
      <div>
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              style: {
                background: '#FFF',
                color: '#000',
              },
            },
          }}
        />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
