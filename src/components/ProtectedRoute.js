import React from 'react';
import { Redirect, Route } from 'react-router-dom';

function ProtectedRoute({ component: Component, user, ...restOfProps }) {
  const isAuthenticated = user ? true : false;

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} user={user} />
        ) : (
          <Redirect to='/signin' />
        )
      }
    />
  );
}

export default ProtectedRoute;
