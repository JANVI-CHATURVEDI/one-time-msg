import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ViewSecret from './pages/ViewSecret';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view/:token" element={<ViewSecret />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
