import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? "youre signed in" : "you are not signed in";
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  console.log("LANDING PAGE");
  const { data } = await client.get("/api/users/currentuser");
  return data;
};

export default LandingPage;
