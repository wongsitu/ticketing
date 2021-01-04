import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/tickets";

it("Should return a 404 if provided id does not exits", async () => {
  const id = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "ascas", price: 20 })
    .expect(404);
});

it("Should return a 401 if there is not session", async () => {
  const id = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "ascas", price: 20 })
    .expect(401);
});

it("Should return a 401 if user does not own the ticket", async () => {
  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", global.signin())
    .send({ title: "ascas", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "sdadqq", price: 32 })
    .expect(401);
});

it("Should return a 404 if the user provides invalid title or price", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", cookie)
    .send({ title: "ascas", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 32 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "hcejc", price: -20 })
    .expect(400);
});

it("Should update valid ticket", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", cookie)
    .send({ title: "ascas", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "hjhvf", price: 32 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("hjhvf");
  expect(ticketResponse.body.price).toEqual(32);
});

it("should publish an event", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", cookie)
    .send({ title: "ascas", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "hjhvf", price: 32 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("Should reject an update request if a ticket is reserved", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", cookie)
    .send({ title: "ascas", price: 20 });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: 100 })
    .expect(400);
});
