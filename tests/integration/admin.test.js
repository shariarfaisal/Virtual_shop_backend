const Admin = require('../../models/Admin');
const request = require('supertest');
const config = require('config')
const jwt = require('jsonwebtoken')
let server;

describe('Admin Routes',() => {
  beforeEach(() => {
    server = require('../../server')
    userName = 'faisal'
  })
  afterEach(async () => {
    server.close()
    await Admin.remove({})
  })

  let userName;

  const exec = async () => {
    return await request(server)
      .post('/api/admin/register')
      .send({userName,name: 'Sharia Emon',password: 'faisal',confirmPassword: 'faisal'})
  }

  const loginExec = async () => {
    return await request(server)
      .post('/api/admin/login')
      .send({userName,password: 'faisal'})
  }

  describe('Post /api/admin/',() => {

    describe('/register',() => {
      it('should return status 201 if all input is ok as expected',async () => {
        const res = await exec();
        expect(res.status).toBe(201)
      })

      it('should save data',async () => {
        await exec();
        const data = await Admin.findOne({userName: 'faisal'})
        expect(data).toHaveProperty('_id')
        expect(data).toHaveProperty('userName','faisal')
      })

      it('should return 400 error if username input value length is less than 3 characters',async () => {
        userName = 'oo'
        const res = await exec();
        expect(res.status).toBe(400)
      })

      it('should return 400 error if username input value length is greater than 55 characters',async () => {
        userName = new Array(57).join('a')
        const res = await exec();
        expect(res.status).toBe(400)
      })

      it('should return 400 error if userName is not defined',async () => {
        userName = ''
        const res = await exec();
        expect(res.status).toBe(400)
      })
    })

    describe('/login',() => {

      it('should status code 200 if username and password match',async () => {
        await exec();
        const res = await loginExec()
        expect(res.status).toBe(200)
        expect(res.error).toBeFalsy()
      })

      it('should return 400 error if username or password not defined',async () => {
        await exec();
        userName = ''
        const res = await loginExec()
        expect(res.status).toBe(400)
        expect(res.error).toBeTruthy()
      })

      it('should return valid jwt token',async () => {
        await exec();
        const res = await loginExec()
        const token = res.text;
        const decoded = jwt.verify(token,config.get('jwtPrivatekey'))
        expect(res.status).toBe(200)
        expect(decoded).toHaveProperty('_id')
      })

      it('should return 400 error if userName or password is invalid',async () => {
        await exec();
        userName = 'faissal'
        const res = await loginExec()
        expect(res.status).toBe(400)
      })


    })
  })

  describe('Get /api/admin',() => {

    it('should return 200',async () => {
      const res = await request(server).get('/api/admin')
      expect(res.status).toBe(200)
    })

    it('Get/ me: should return loged admin data',async () => {
      await exec();
      const login = await loginExec()
      const res = await request(server)
                  .get('/api/admin/me')
                  .set('admin_token',login.text)
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('userName','faisal')
    })

    it('should return 401 if token is not provided',async () => {
      await exec();
      const login = await loginExec()
      const res = await request(server)
                  .get('/api/admin/me')
      expect(res.status).toBe(401)
    })

    it('should return 400 if token is not valid',async () => {
      await exec();
      const login = await loginExec()
      const res = await request(server)
                  .get('/api/admin/me')
                  .set('admin_token','hads32')
      expect(res.status).toBe(400)
    })


  })

  describe('Put /api/admin',() => {
    let name;
    let userName;

    const updateExec = async () => {
      const admin = await exec()
      const login = await loginExec();
      return  await request(server)
        .put('/api/admin')
        .set('admin_token',login.text)
        .send({userName,name,oldPassword: 'faisal',newPassword: 'farhad'})
    }

    beforeEach(() => {
      name = 'Sharia Emon Faisal'
      userName = 'faisal'
    })

    it('should return 200 if everything is ok as expected',async () => {
      const res = await updateExec()
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('userName','faisal')
      expect(res.body).toHaveProperty('name','Sharia Emon Faisal')
    })

    it('should return 400 error if input length is less than 3 characters',async () => {
      name = 'fa'
      const res = await updateExec()
      expect(res.status).toBe(400)
    })

    it('should return 401 error if token is not provided',async () => {
      const admin = await exec()
      const login = await loginExec();
      const res = await request(server)
        .put('/api/admin')
        .send({userName,name,oldPassword: 'faisal',newPassword: 'farhad'})
      expect(res.status).toBe(401)
    })

    it('should return 400 error if token is not valid',async () => {
      const admin = await exec()
      const login = await loginExec();
      const res = await request(server)
        .put('/api/admin')
        .set('admin_token','invalid token')
        .send({userName,name,oldPassword: 'faisal',newPassword: 'farhad'})
      expect(res.status).toBe(400)
    })
  })

  describe('Delete /api/admin',() => {

    it('should return 200 if data has been deleted',async () => {
      await exec()
      const login = await loginExec()
      const me = await request(server)
        .get('/api/admin/me')
        .set('admin_token',login.text)
      const res = await request(server)
        .delete('/api/admin/'+me.body._id)

      expect(res.status).toBe(200)
    })

    it('should return 400 error if ObjectId is invalid',async () => {
      await exec()
      const login = await loginExec()
      const me = await request(server)
        .get('/api/admin/me')
        .set('admin_token',login.text)
      const res = await request(server)
        .delete('/api/admin/23')

      expect(res.status).toBe(400)
    })

    it('should return 404 error if ObjectId is not provided',async () => {
      await exec()
      const login = await loginExec()
      const me = await request(server)
        .get('/api/admin/me')
        .set('admin_token',login.text)
      const res = await request(server)
        .delete('/api/admin/')

      expect(res.status).toBe(404)
    })

  })


})
