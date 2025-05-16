import React, { useState, useEffect } from 'react';
import './App.css';
import { Authenticator, View, Text, Heading, Button, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { getCurrentUser, fetchUserAttributes, signOut } from 'aws-amplify/auth';
import TodoList from './components/TodoList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [user, setUser] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      const attributes = await fetchUserAttributes();
      if (attributes.email) {
        setUserEmail(attributes.email);
      }
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
                      <Text>Loading My-Do</Text>
                    </View>
                  );
                }}
              </Authenticator>
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                        <Heading level={3} className="text-xl font-bold text-blue-600">My-Do</Heading>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                          <Text className="text-sm font-medium text-gray-700">Hello, {userEmail}</Text>
                      </div>
                      <Button
                        colorTheme="overlay"
                        onClick={handleSignOut}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <TodoList />
            </main>
          </div>
        )}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
    </ThemeProvider>
  );
}

export default App;
