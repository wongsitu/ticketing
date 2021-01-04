import React from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

const SignUp = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign up</h1>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          className="form-control"
        />
      </div>
      {errors}
      <button type="submit" className="btn btn-primary">
        Sign up
      </button>
    </form>
  );
};

export default SignUp;
