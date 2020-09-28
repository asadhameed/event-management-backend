const mongoose = require('mongoose');
const request = require('supertest');
const path = require('path')
const fs = require('fs')
const User = require('../../../src/models/User')
let server;
describe('Event Controller', () => {
    beforeEach(() => {
        server = require('../../../src/server');
    })
    afterEach(() => {
        server.close();
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
                .post('/event').set('user_id', user_id).send({ title, description, price });
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
            let thumbnail ='thumbnail'
            const res = await request(server)
                .post('/event')
                .set('user_id', user_id)
                .attach(thumbnail, path.resolve(__dirname, 'test.png'))
                .field('title', title)
                .field('description', description)
                .field('price', price);
            expect(res.status).toBe(200)
            expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['title', 'description', 'price', 'user']))
            const filepath = './src/images/'+ res.body.thumbnail;
           
            await fs.unlinkSync(filepath)
        })
    })
})