import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { setContext } from '@apollo/client/link/context'
import { createClient } from 'graphql-ws'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { WebSocketLink } from '@apollo/client/link/ws'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
      headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : null
      }
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

const wsLink = new GraphQLWsLink(  createClient({ 
  url: 'ws://localhost:4000/graphql' 
}))

const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (      
          definition.kind === 'OperationDefinition' &&      
          definition.operation === 'subscription'    
          )  
      },  
      wsLink,  
      authLink.concat(httpLink))

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
