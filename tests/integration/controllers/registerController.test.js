const e = require('express');
const request = require('supertest');
const User = require('../../../src/models/User.js');
let server;
describe('RegisterController', () => {
    beforeEach(() => {

        server = require('../../../src/server.js')
    })
    afterEach(async () => {
        await User.deleteMany({})
        await server.close()
    })
    describe('Post Method', () => {
        let firstName;
        let lastName;
        let email;
        let password;
        let confirmPassword;
        beforeEach(() => {
            firstName = 'aaa'
            lastName = 'bbb'
            email = 'test@test.com'
            password= '123456'
            confirmPassword='123456'
        })
        const exec = () => {
            return request(server).post('/').send({ firstName, lastName, email, password , confirmPassword})
        }

        it('Should return 400 If First name is less then 3', async () => {
            firstName = 'aa'
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('Should return 400 IF First name is less then 20', async () => {
            firstName = new Array(22).join('a')
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should return 400 If Last name is greater then 3', async () => {

            lastName = 'bb'
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should return 400 If Last name is greater then 20', async () => {
            lastName = new Array(22).join('b');
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should return 400 If invalid Email', async () => {
            email = 'test';
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should return 400 If Password is less then 6', async()=>{
            password='1234'
            const res = await exec();
            expect(res.status).toBe(400)
        })
        it('should return 400 If Password is greater then 20', async()=>{
            password = new Array(22).join('1')
            const res = await exec();
            expect(res.status).toBe(400)
        })
        it('should return 400 If confirm Password is not same', async()=>{
            confirmPassword='1234578'
            const res = await exec();
            expect(res.status).toBe(400)
        })
        it('should return 400 If Email is already register', async()=>{
            await User.insertMany([
                {firstName, lastName, password,email}
            ])
            const res = await exec();
            expect(res.status).toBe(400)
        })
        it('should return 200 If First name, Last name, Email and Password are valid', async () => {
            const res = await exec();
            expect(res.status).toBe(200)
        })
    })

})