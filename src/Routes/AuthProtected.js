import React, { useEffect } from "react";
import { Navigate, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useStateContext } from "../contexts/ContextProvider.jsx";
const AuthProtected = (props) => {
  const dispatch = useDispatch();
  const { currentUser } = useStateContext();
  useEffect(() => {
    
  }, [currentUser, dispatch]);

  /*
    Navigate is un-auth access protected routes via url
    */

  if (!currentUser) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};

export { AuthProtected, AccessRoute };