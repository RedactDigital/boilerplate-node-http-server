# Graphql Express Sequelize Passport MySQL

## Installation

### Method 1:

1. Clone the repository
2. Install dependencies `npm install`
3. Create environment file `npm run env`
4. Create secure keys `npm run make:keys`
5. Run server `npm start`

### Method 2: (Not fully implemented yet)

1. Clone the repository
2. Create environment file. For redis and database connections, add your machines ipaddress to the respective variables, not localhost. _If you are using WSL ensure you use that IP adress not your machine ip address_
3. Run docker-compose `docker-compose up`

_Note: If you are using docker-compose, you can run the server with `docker-compose up -d` to start the server in the background and `docker-compose down` to stop the server._

**Important: If you are using docker-compose, you need to run docker-compose in the root directory of the project.**

<!-- TODO Create command to set server up with one command -->

---

### Query

```
query {
  getAllUsers {
    lastName,
    password
  }
}
```

### Mutation

```
mutation {
  createUser(firstName: "patrick", lastName: "rizzardi") {
    firstName // This is the data you want returned
  }
}
```

### Validation package docs

- https://github.com/mikeerickson/validatorjs

## Using the Graphql Server

1. Define the type definition in the `src/schemas/typeDefs` folder
2. Add the type definition to the `src/schemas/index.js` file
3. Create the resolvers in the `src/schemas/resolvers` folder
   - For example, if you want to create a new user, you would create a new resolver in the `src/schemas/resolvers/mutations/users/createUser.js` file
   - Notice that each resolver is grouped into a folder, and the file name is the name of the mutation or query
   - Example for a query: `src/schemas/resolvers/queries/users/getAllUsers.js`
4. Once the resolver is created, add it to the index file of the `resolver/query` or `resolver/mutation` folder relative to the file you created it in
