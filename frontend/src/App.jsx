import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';

function App() {
  // 'home', 'login', or 'register'
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <LandingPage 
                  onLoginClick={() => setCurrentPage('login')} 
                  onRegisterClick={() => setCurrentPage('register')} 
               />;
      case 'login':
        return <LoginPage onSwitch={(page) => setCurrentPage(page)} />;
      case 'register':
        return <Register onSwitch={(page) => setCurrentPage(page)} />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="App">
      {/* Navigation logic rendering */}
      {renderPage()}
    </div>
  );
}

export default App;