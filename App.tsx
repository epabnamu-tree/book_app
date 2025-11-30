import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import BookDetail from './pages/BookDetail';
import Discussion from './pages/Discussion';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Library from './pages/Library';
import { DataProvider } from './context/DataContext';

const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/library" element={<Library />} />
            {/* Dynamic Route for Books */}
            <Route path="/book/:id" element={<BookDetail />} />
            {/* Backward compatibility */}
            <Route path="/book-info" element={<Home />} /> 
            
            <Route path="/discussion" element={<Discussion />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
};

export default App;