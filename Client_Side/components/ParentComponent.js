// ParentComponent.js
import { useState } from 'react';
import CreateAccountForm from './CreateAccountForm'; // Adjust the path as per your project structure

const ParentComponent = () => {
  const [isAccountCreated, setIsAccountCreated] = useState(false);

  const handleCreateAccount = async (email, password) => {
    // Logic to handle the creation of the account
    console.log('Account created successfully:', email);
    // Update state to show success message or navigate to another page
    setIsAccountCreated(true);
  };

  return (
    <div>
      <h1>Create Account</h1>
      {!isAccountCreated ? (
        <CreateAccountForm onCreateAccount={handleCreateAccount} />
      ) : (
        <div>
          <p>Account created successfully!</p>
          {/* Add button to login or navigate to login page */}
        </div>
      )}
    </div>
  );
};

export default ParentComponent;
