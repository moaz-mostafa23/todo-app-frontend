import React, { useState, useEffect } from 'react';
import './App.css';
import { Authenticator, View, Text, Heading, Button, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { getCurrentUser, signOut } from 'aws-amplify/auth';

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setUser(null);
      console.log('No authenticated user:', err);
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  return (
    <ThemeProvider>
      <div className="App">
        {!user ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md">
              <Authenticator>
                {({ user }) => {
                  if (user) {
                    setUser(user);
                  }
                  return (
                    <View className="p-6 bg-white rounded-lg shadow-md">
                      <Heading level={3} className="mb-4 text-center">Sign in successful</Heading>
                      <Text>Loading your Todo application...</Text>
                    </View>
                  );
                }}
              </Authenticator>
            </div>
          </div>
        ) : (
          <div className="min-h-screen p-6 bg-gray-100">
            <header className="mb-8 flex items-center justify-between">
              <div>
                <Heading level={3}>Todo App</Heading>
                <Text>Hello, {user.username}</Text>
              </div>
              <Button variation="primary" onClick={handleSignOut}>Sign Out</Button>
            </header>
              <main>
                <View className="p-6 bg-white rounded-lg shadow-md">
                  <Heading level={4} className="mb-4">Your Todo List</Heading>
                  <Text>Todo app content will go here</Text>
                </View>
              </main>
            </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
