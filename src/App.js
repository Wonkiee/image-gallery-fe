import './App.css';
import FrontPage from './components/FrontPage/frontPage';
import "bootstrap/dist/css/bootstrap.css";

import { getAllImages } from './services/imageService';

function App() {
  return (
    <div className="App">
      <FrontPage/>
    </div>
  );
}

export default App;
