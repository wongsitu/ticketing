import React, { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

const SignUp = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);
  return <div>Signin you out ...</div>;
};

export default SignUp;
