const mongoose = require('mongoose');
const request = require('supertest');
const path = require('path')
const fs = require('fs')
const User = require('../../../src/models/User')
const Event = require('../../../src/models/event')
let server;
describe('Event Controller', () => {
    beforeEach(() => {
        server = require('../../../src/server');
    })
    afterEach(async () => {
        await server.close();
        await Event.deleteMany({});
    })
    describe('Post Method', () => {
        let title;
        let description;
        let price;
        let user_id;
        beforeEach(() => {
            title = 'Event Title';
            description = 'Event Description';
            price = 10;
            user_id = mongoose.Types.ObjectId()

        })

        const exec = () => {
            return request(server)
                .post('/events').set('user_id', user_id).send({ title, description, price });
        }
        it('should return 400 If Title is less then 4 characters', async () => {
            title = 'aaa'
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should return 400 if Title is greater then 30 characters', async () => {
            title = new Array(32).join('a')
            const res = await exec();
            expect(res.status).toBe(400)
        })
        it('should return 400 if the description is not provide', async () => {
            description = '';
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should return 400 if price is less then zero', async () => {
            price = 0;
            const res = await exec();
            expect(res.status).toBe(400)
        })


        it('should return 400 if user id is invalid', async () => {
            user_id = 1;
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should return 400 if user is not exist', async () => {
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should return 200 if valid input', async () => {

            const user = new User(
                {
                    firstName: 'aaa',
                    lastName: 'bbb',
                    email: 'test@test.com',
                    password: '1234567'
                })
            await user.save();
            user_id = user._id;
            let thumbnail = 'thumbnail'
            const res = await request(server)
                .post('/events')
                .set('user_id', user_id)
                .attach(thumbnail, path.resolve(__dirname, 'test.png'))
                .field('title', title)
                .field('description', description)
                .field('price', price);
            expect(res.status).toBe(200)
            expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['title', 'description', 'price', 'user']))
            const filepath = './src/images/' + res.body.thumbnail;
            await fs.unlinkSync(filepath)
        })
    })
    describe('Get Method', () => {
        let eventId;
        const exec = () => {
            return request(server).get('/events/' + eventId)
        }
        it('Should return 400 if invalid event id', async () => {
            eventId = 1;
            const res = await exec();
            expect(res.status).toBe(400)
        })
        it('Should return 404 if event do not exist', async () => {
            eventId = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404)
        })
        it('Should return 200 and event', async () => {
            const event = new Event({
                title: 'Event',
                description: 'This is event'
            })
            await event.save();
            eventId = event._id;
            const res = await exec();
            expect(res.status).toBe(200)
            expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['title', 'description']))
        })
        it('Should return 200 and empty events if there is no event in database', async () => {
            const res = await request(server).get('/events');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0)
        })

        it('Should return 200 and empty events if there is no event in database', async () => {
            await Event.insertMany([
                {
                    title: 'Event 1',
                    description: 'This is event 1'
                },
                {
                    title: 'Event 2',
                    description: 'This is event 2'
                }
            ])
            const res = await request(server).get('/events');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2)
        })
    })
})