import request from "supertest";
import { app } from "../../app";

it("Should return a 201 on a successful signup", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);
});

it("Should return a 400 with an invalid email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "tacoburrito", password: "password" })
    .expect(400);
});

it("Should return a 400 with an invalid password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "testing@testing.com", password: "123" })
    .expect(400);
});

it("Should return a 400 with email and password missing", async () => {
  await request(app).post("/api/users/signup").send({}).expect(400);
});

it("Should not allow user to signup more than once", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
