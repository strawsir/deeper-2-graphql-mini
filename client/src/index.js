import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// Apollo sets up a 1 time connection to the server and remembers it.
// This is how we define that connection
const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

// The client is the engine that executes all of our instructions
const client = new ApolloClient({
  link: httpLink, // So it knows where to send requests
  cache: new InMemoryCache() // Caching is a double-edged sword
})

ReactDOM.render(
<ApolloProvider client={client}>
<App />
</ApolloProvider>
, document.getElementById('root'));
registerServiceWorker();
