import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";

import { fetchRestCheck } from "../store/rest_check";

const Home = () => {
  const dispatch = useDispatch();
  const restCheck = useSelector((state) => state.restCheck);
  useEffect(() => {
    const action = fetchRestCheck();
    dispatch(action);
  }, [dispatch]);

  const [showBugComponent, setShowBugComponent] = useState(false);

  return (
    <>
      <h1>UNION</h1>
      <p>Simplify immigration sponsorship with chatlog insights</p>
      <h2>Rest API</h2>
      <p>{restCheck?.data?.payload?.result}</p>
      <Button variant="outline-dark" onClick={() => setShowBugComponent(true)}>
        Click to test if Sentry is capturing frontend errors! (Should only work
        in Production)
      </Button>
      {showBugComponent && showBugComponent.field.notexist}
      <h2>Get the latest updates</h2>
      <input type="email" placeholder="Your email address" />
      <Button variant="primary">Get started</Button>
    </>
  );
};

export default Home;
