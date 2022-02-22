import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if provided id does not exits', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'slfjsfjs',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'slfjsfjs',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own ticket', async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'slfjsfjs',
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'xxxxxxx',
      price: 30,
    })
    .expect(401);
});

it('returns a 400 if user provides an invalid title or price', async () => {
  const currentUserCookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', currentUserCookie)
    .send({
      title: 'slfjsfjs',
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', currentUserCookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', currentUserCookie)
    .send({
      title: 'abcd',
      price: -20,
    })
    .expect(400);
});

it('update the ticket', async () => {
  const currentUserCookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', currentUserCookie)
    .send({
      title: 'slfjsfjs',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', currentUserCookie)
    .send({
      title: 'New Title',
      price: 100,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('New Title');
  expect(ticketResponse.body.price).toEqual(100);
});

it('publishes an event', async () => {
  const currentUserCookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', currentUserCookie)
    .send({
      title: 'slfjsfjs',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', currentUserCookie)
    .send({
      title: 'New Title',
      price: 100,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects update if the ticket is reserved', async () => {
  const currentUserCookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', currentUserCookie)
    .send({
      title: 'slfjsfjs',
      price: 20,
    });

  const ticket = await Ticket.findById(response.body.id);
  ticket?.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket?.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', currentUserCookie)
    .send({
      title: 'New Title',
      price: 100,
    })
    .expect(400);
});
