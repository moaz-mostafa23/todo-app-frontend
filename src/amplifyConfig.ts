import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  const amplifyConfig = {
    Auth: {
      Cognito: {
        userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID!,
        userPoolClientId: process.env.REACT_APP_COGNITO_CLIENT_ID!,
        identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID!,
      }
    }
  };

  Amplify.configure(amplifyConfig);
};