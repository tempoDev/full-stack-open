const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v4: uuid } = require("uuid");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRET || "supersecreto";
const logger = require("./utils/logger");
const config = require("./utils/config");
const mongoose = require("mongoose");
const { UserInputError } = require("apollo-server-core");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const { expressMiddleware } = require("@apollo/server/express4");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { PubSub } = require('graphql-subscriptions');
const { subscribe } = require("diagnostics_channel");
const pubsub = new PubSub()

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB: ", error.message);
  });

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]
  }

  type Author {
    name: String!
    id: ID!
    born: Int,
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Mutation {
    addBook(
      title: String!
      author: String! 
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }

  type Query {
    bookCount: Int!
    authorCount: Int!,
    allBooks(author: String, genre: String): [Book!],
    allAuthors: [Author!]!,
    me: User
  }

  type Subscription {
    bookAdded: Book!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    me: (root, args, context) => {
      return context.currentUser;
    },
    allBooks: async (root, args) => {
      let filter = {};

      /*if (args.author) {
        filteredBooks = filteredBooks.filter( book => book.author === args.author )
      }*/

      if (args.genre) {
        filter.genres = { $in: [args.genre] };
      }

      const books = await Book.find(filter).populate("author");
      return books;
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      const books = await Book.find({});

      return authors.map((author) => {
        const bookCount = books.filter(
          (book) => String(book.author) === String(author._id)
        ).length;
        return {
          name: author.name,
          id: author._id,
          born: author.born,
          bookCount,
        };
      });
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      const { title, author, published, genres } = args;
      let authorExists = await Author.findOne({ name: author });

      if (!authorExists) {
        authorExists = new Author({ name: author });

        try {
          await authorExists.save();
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        }
      }

      const book = new Book({
        title: title,
        published: published,
        author: authorExists._id,
        genres: genres,
      });

      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      pubsub.publish('BOOK_ADDED', {bookAdded: book})

      return await book.populate("author");
    },

    editAuthor: async (root, args) => {
      const { name, setBornTo } = args;
      const author = await Author.findOne({ name: name });

      if (!author) {
        return null;
      }

      author.born = setBornTo;

      try {
        await author.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return author;
    },

    createUser: async (root, args) => {
      const { username, favoriteGenre } = args;
      const existsUser = await User.findOne({ username });

      if (existsUser) {
        throw new UserInputError("El usuario ya existe", {
          invalidArgs: args,
        });
      }

      const user = new User({
        username,
        favoriteGenre,
      });

      return user.save();
    },

    login: async (root, args) => {
      const { username, password } = args;
      const user = await User.findOne({ username });

      if (!user || password !== "secreta") {
        throw new UserInputError("Credenciales incorrectas");
      }

      const userToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userToken, JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator(['BOOK_ADDED'])
    }
  }
};

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith("Bearer")) {
          const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
          const currentUser = await User.findById(decodedToken.id);

          return { currentUser };
        }
      },
    })
  );

  const port = 4000
  httpServer.listen( port, () => console.log(`Server ready at http://localhost:${port}`))
};

start()
