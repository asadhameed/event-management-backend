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
        const imagesFolder = './src/images/';
        const files = await fs.promises.readdir(imagesFolder)
        files.forEach(async file => await fs.unlinkSync(imagesFolder + file))
    })
    const insertOneEvent = async () => {
        return await new Event({
            title: 'Event 1',
            description: 'this is event 1 of  running',
            eventType: 'running'
        }).save()


    }

    const insertManyEvents = () => {
        Event.insertMany([
            {
                title: 'Event 1',
                description: 'this is event 1 of  running',
                eventType: 'running'
            },
            {
                title: 'Event 2',
                description: 'this is event 2 of running',
                eventType: 'running'
            },
            {
                title: 'Event 3',
                description: 'this is event 3 of walking',
                eventType: 'walking'
            },
        ])

    }
    describe('Post Method', () => {
        let title;
        let description;
        let price;
        let user_id;
        let eventType;
        let thumbnail;

        beforeEach(async () => {
            const user = new User(
                {
                    firstName: 'aaa',
                    lastName: 'bbb',
                    email: 'test@test.com',
                    password: '1234567'
                })
            await user.save();
            user_id = user._id;
            title = 'Event Title';
            description = 'Event Description';
            price = 10;
            eventType = 'type'
            thumbnail = 'thumbnail'
        })

        const exec = () => {
            return request(server)
                .post('/event')
                .set('user_id', user_id)
                .attach(thumbnail, path.resolve(__dirname, 'test.png'))
                .field('title', title)
                .field('description', description)
                .field('eventType', eventType)
                .field('price', price);
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

        it('should return 400 if the Even Type is not provide', async () => {
            eventType = '';
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
            user_id = mongoose.Types.ObjectId()
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should return 200 if valid input', async () => {
            const res = await exec()
            expect(res.status).toBe(200)
            expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['title', 'description', 'price', 'user']))
        })
    })
    describe('Get Event by id', () => {
        let eventId;
        const exec = () => {
            return request(server).get('/event/' + eventId)
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
           const event = await insertOneEvent()
            eventId = event._id;
            const res = await exec();
            expect(res.status).toBe(200)
            expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['title', 'description']))
            
        })
    })
    describe('Get All events', () => {
        it('Should return 200 and empty body if there is no event in database', async () => {
            const res = await request(server).get('/events');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0)
        })

        it('Should return 200 and events if there is events in  the database', async () => {
          
            await insertManyEvents();
            const res = await request(server).get('/events');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3)
         
            //expect(Object.keys(res.body[0])).toEqual(expect.arrayContaining(['title', 'description']))
        })
    })
    describe('Get Events by Type', () => {

        it('Should return 200 and empty body if there is no event the in database', async () => {
            const res = await request(server).get('/events/running');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0)
        })

        it('should return 200 and events if there is specific type of events in database', async () => {
            // come here
            await insertManyEvents()
            const res = await request(server).get('/events/running');
            // because there is 2 running events
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            
            // expect(Object.keys(res.body[0])).toEqual(expect.arrayContaining(['title', 'description', 'evenType']))
        })
    })
    describe('Delete the event', () => {
        let eventId;
        const exec = () => {
            return request(server).del('/event/' + eventId)
        }
        it('should return 400 if invalid event id', async () => {
            eventId = 1;
            const res = await exec();
            expect(res.status).toBe(400)
        })
        it('should return 404 if event is not found', async () => {
            eventId = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404)
        })
        it('should return 200 and delete the event. The event should send back to customer', async () => {
            const event =  insertOneEvent();
            eventId= (await event)._id;
            const res = await exec();
            expect(res.status).toBe(200)
            expect(res.body).toMatchObject(event)
          //  expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['title', 'description', 'evenType']))
        })
    })
})