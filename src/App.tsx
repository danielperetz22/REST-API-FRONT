import { HomePage } from './components/Home_page';
import { Header } from './components/Header';
import './App.css';

function App() {
  return (
    <div>
      <div className="HeaderContainer">
        <Header />
      </div>
      <div className="HomePageContainer">
        <HomePage />
      </div>
    </div>
  );
}

export default App;
