// components/Layout.js

const Layout = ({ children, onLogout }) => {
  // Function to handle logout
  const handleLogout = () => {
    // Clear user email from localStorage
    localStorage.removeItem('userEmail');
    // Call the logout handler function passed as a prop
    if (typeof onLogout === 'function') {
      onLogout();
    }
  };

  return (
    <div className="layout">
      <header>
        <h1>Next.js Task Tracker</h1>
        <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2024 Next.js Task Tracker</p>
      </footer>
      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        header {
          background-color: #333;
          color: #fff;
          padding: 20px;
          text-align: center;
          display: flex;
          justify-content: space-between; // Align items to the right
          align-items: center; // Vertically center items
        }
        button {
          background-color: transparent;
          color: #fff;
          border: none;
          cursor: pointer;
        }
        button:hover {
          text-decoration: underline;
        }
        main {
          flex-grow: 1;
          padding: 20px;
        }
        footer {
          background-color: #333;
          color: #fff;
          padding: 10px 0;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Layout;
