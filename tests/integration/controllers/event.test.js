const mongoose = require('mongoose');
const request = require('supertest');
const path = require('path')
const fs = require('fs')
const jwt=require('jsonwebtoken')
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
    const createUser=()=>{

       return new User(
            {
                firstName: 'aaa',
                lastName: 'bbb',
                email: 'test@test.com',
                password: '1234567'
            }).save()
    }
    describe('Post Method', () => {
        let title;
        let description;
        let price;
        let user_id;
        let eventType;
        let thumbnail;

        beforeEach(async () => {
            const user = await createUser();
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
            expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['title', 'description', 'price', 'user', 'eventType']))
        })
    })

    describe('Delete the event', () => {
        let eventId;
        let userId;
        let token;
        beforeEach( async()=>{
            const user = await createUser();
            const event = await new Event({
                title: 'Event 1',
                description: 'this is event 1 of  running',
                eventType: 'running',
                user: user._id
            }).save();
            token=  await user.generateAuthToken();
            userId = user._id;
            eventId= event._id;

        })
        const exec = () => {
            return request(server).del('/event/' + eventId).set('x-auth-token', token);
        }
        it('should return 401 if invalid token', async()=>{
            token='';
            const res = await exec();
            expect(res.status).toBe(401)
        })
        it('should return 400 if wrong token ', async()=>{
            token = 'myowntokenstring';
            const res = await exec()
           expect(res.status).toBe(400)
        })
        it('should return 400 if generate fake token ', async()=>{
            token = jwt.sign({_id:'1',isLogin:false}, "generate_Fake_token")
            const res = await exec()
           expect(res.status).toBe(400)
        })

        it('should return 401 if token valid but not login ', async()=>{
            token = jwt.sign({_id:'1',isLogin:false}, process.env.JWT_PRIVATE_KEY)
            const res = await exec()
           expect(res.status).toBe(401)
        })

        
        it('should return 400 if user._id is invalid ', async()=>{
            token = jwt.sign({_id:'2',isLogin:true}, process.env.JWT_PRIVATE_KEY)
            const res = await exec()
           expect(res.status).toBe(400)
        })

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

       
        it('should return 401 if user Id is valid but user have not the event', async()=>{
            token = jwt.sign({_id:mongoose.Types.ObjectId(),isLogin:true}, process.env.JWT_PRIVATE_KEY)
            const res= await exec();
            expect(res.status).toBe(401)
        })
       
        it('should return 204 and delete the event.', async () => {
            const res = await exec();
            expect(res.status).toBe(204)
            //expect(res.body).toMatchObject(event)
           // expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['title', 'description', 'evenType']))
        })
    })
})