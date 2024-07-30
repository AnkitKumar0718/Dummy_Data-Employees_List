import React from 'react';
import UserList from './components/UserList';

function App() {
  return (
    <div className="App">
      <header className=" bg-blue-400 text-black text-center p-4 font-bold">
        <h1>Employees List</h1>
      </header>
      <UserList />
    </div>
  );
}

export default App;
