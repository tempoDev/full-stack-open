const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")
const api = supertest(app)
const User = require("../models/user")

describe("when there is initially one user saved", () => {
    beforeEach(async () => {
      await User.deleteMany({});
  
      const passwordHash = await bcrypt.hash("example", 10);
      await new User({ username: "tempo", passwordHash }).save();
    });
  
    test("user is returned", async () => {
      const usersAtStart = await helper.usersInDb();
  
      expect(usersAtStart[0].username).toBe("tempo");
    });
  
    test("create a new user", async () => {
      
        const initialUsers = await User.find({})
  
      const newUser = {
        username: "tempoExample",
        name: "tempo",
        password: "example",
      };
  
      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);
  
      const endUsers = await User.find({})
      expect(endUsers).toHaveLength(initialUsers.length + 1);
  
      const users = endUsers.map((user) => user.username);
      expect(users).toContain(newUser.username);
    });

    test('Creation of new user fails if the username is already taken', async () => {

      const users = await User.find({})
  
      const newUser = {
          username: 'tempo',
          name: 'Tempo',
          password: 'alksjda'
      }
  
      const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/)
  
      expect(result.body.error).toContain('`username` to be unique')
  
      const finalUsers = await User.find({})
      expect(finalUsers).toEqual(users)
  })
  
    test("fails if username is missing", async () => {
      
        const initialUsers = await User.find({})
  
      const newUser = {
        name: "tempo",
        password: "failed",
      };
  
      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/)
  
      expect(result.body.error).toContain("Username and password are required")
  
      const endUsers= await User.find({})
      expect(endUsers).toHaveLength(initialUsers.length)
    });
  
    test("fails if password is missing", async () => {
        const initialUsers = await User.find({})
  
        const newUser = {
          name: "tempo",
          username: "failed"
        };
    
        const result = await api
          .post("/api/users")
          .send(newUser)
          .expect(400)
          .expect("Content-Type", /application\/json/)
    
        expect(result.body.error).toContain("Username and password are required")
    
        const endUsers= await User.find({})
        expect(endUsers).toHaveLength(initialUsers.length)
    });
  
    test("fails if username is less than 3 characters", async () => {
        const initialUsers = await User.find({})
  
      const newUser = {
        username: "te",
        name: "mpo",
        password: "failed",
      }
  
      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/)
  
      expect(result.body.error).toContain('Username and password must be at least 4 characters long')
  
        const endUsers= await User.find({})
        expect(endUsers).toHaveLength(initialUsers.length)
    });
  
    test("fails if password is less than 3 characters", async () => {
        const initialUsers = await User.find({})
  
      const newUser = {
        username: "tempo",
        name: "fail",
        password: "ed",
      }
  
      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/)
  
        expect(result.body.error).toContain('Username and password must be at least 4 characters long')
  
        const endUsers= await User.find({})
        expect(endUsers).toHaveLength(initialUsers.length)
    });
    
  });
  
  afterAll(() => {
    mongoose.connection.close();
  });