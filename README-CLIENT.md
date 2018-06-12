# Client side graphql in react

## Installing Apollo

* `npm i apollo-client-preset react-apollo graphql-tag graphql`
 * graphql is for executing queries
 * graphql-tag is for setting them up
 * react-apollo is for interacting with react. It uses graphql underneath it
 * apollo-client-preset is a package with 4 other libraries in it :
`apollo-client`, `apollo-cache-inmemory`,`apollo-link`, `apollo-link-http`

## Setting up apollo

Change app.js to have the following code :

```diff
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
// Let's bring in all the apollo goodies we got from apollo and the apollo preset
+import { ApolloProvider } from 'react-apollo'
+import { ApolloClient } from 'apollo-client'
+import { HttpLink } from 'apollo-link-http'
+import { InMemoryCache } from 'apollo-cache-inmemory'

+// Apollo sets up a 1 time connection to the server and remembers it.
+// This is how we define that connection
+const httpLink = new HttpLink({ uri: 'http://localhost:4000' })
+
+// The client is the engine that executes all of our instructions
+const client = new ApolloClient({
+  link: httpLink, // So it knows where to send requests
+  cache: new InMemoryCache() // Caching is a double-edged sword
+})

// Wrap our app in our provider so that our engine can handle requests
ReactDOM.render(
+  <ApolloProvider client={client}>
    <App />
+  </ApolloProvider>
  , document.getElementById('root')
)
registerServiceWorker()
```

## Let's create a file to show our links off and add it into app

This is standard react code.  Nothing new to see.

* Create a new file `Links.js`

```javascript
import React, { Component } from 'react'

class Links extends Component {
    render() {
        const data = [
            {
                id: '1',
                description: 'Text',
                url: 'https://www.google.com',
            },
            {
                id: '2',
                description: 'Test 2',
                url: 'https://www.devmountain.com',
            },
        ]

        return (
            <div>{data.map(link => (
                <div>
                    {link.description} ({link.url})
                </div>
            ))}</div>
        )
    }
}

export default Links
```

* Change App.js

```diff
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
+import Links from './Links'

class App extends Component {
  render() {
    return (
-      <div className="App">
-        <header className="App-header">
-          <img src={logo} className="App-logo" alt="logo" />
-          <h1 className="App-title">Welcome to React</h1>
-        </header>
-        <p className="App-intro">
-          To get started, edit <code>src/App.js</code> and save to reload.
-        </p>
-      </div>
+      <Links/>
    );
  }
}

export default App;
```

## Adding apollo into our component 

```diff

import React, { Component } from 'react'
+import { graphql } from 'react-apollo'
+import gql from 'graphql-tag'

class Links extends Component {
    render() {
+        //linksQuery = the name we gave it below 
+        //stream.links = this is walking into the results
+        //This is the same structure you see in the query we built below
+        const data = this.props.linksQuery.stream.links

        return (
            <div>{data.map(link => (
                <div>
                    {link.description} ({link.url})
                </div>
            ))}</div>
        )
    }
}

+// Let's build a graphql query
+// The first line is what we want to call in here in the client.  Technically it's not needed
+// The second line is the query we want to call on the server
+// The third and on is the data we're getting back with which pieces we want
+const LINKS_QUERY = gql`
+  query LinksQuery {
+    stream {
+      links {
+        id
+        url
+        description
+      }
+    }
+  }
+`

+// If we wrap our component like this it will auto run the query for us
+// And put the results on props
+export default graphql(LINKS_QUERY, { name: 'linksQuery' })(Links)
-export default Links
```

## Adding Links

Let's create a new file to add links

```javascript
import React, { Component } from 'react'

class AddLink extends Component {
  state = {
    desc: '',
    url: '',
  }

  render() {
    return (
      <div>
        <div>
          <input
            value={this.state.desc}
            onChange={e => this.setState({ desc: e.target.value })}
            placeholder="A description to send to the server"
          />
          <input
            value={this.state.url}
            onChange={e => this.setState({ url: e.target.value })}
            placeholder="A url for our link record"
          />
        </div>
        <button onClick={() => this._addLink()}>Save</button>
      </div>
    )
  }

  _addLink = async () => {
    // More to come
  }
}

export default AddLink
```

## Connecting our add component to graphql

```diff
import React, { Component } from 'react'
+import { graphql } from 'react-apollo'
+import gql from 'graphql-tag'

class AddLink extends Component {
    state = {
        desc: '',
        url: '',
    }

    render() {
        return (
            <div>
                <div>
                    <input
                        value={this.state.desc}
                        onChange={e => this.setState({ desc: e.target.value })}
                        placeholder="A description to send to the server"
                    />
                    <input
                        value={this.state.url}
                        onChange={e => this.setState({ url: e.target.value })}
                        placeholder="A url for our link record"
                    />
                </div>
                <button onClick={() => this._addLink()}>Save</button>
            </div>
        )
    }

    _addLink = async () => {
+        const { description, url } = this.state
+        //addLink was added to props by our graphql() setup below
+        await this.props.addLink({
+            //We pass in a variables object containing the data
+            variables: {
+                description, //matches $description defined in our query
+                url //matches $url defined in our description
+            }//The type of data we send in must match what's defined in our query
+        })
    }
}


+// First line is for setup/local use.  We name our mutation and then
+//   Describe the variables we will need to make it work
+// Second line uses the mutation we defined on the server and passes the
+//   Variables along
+// Third line and on are asking for data back when the request is complete
+
+const ADD_MUTATION = gql`
+  mutation AddMutation($description: String!, $url: String!) {
+    addLink(description: $description, url: $url) {
+      id
+      createdAt
+      url
+      description
+    }
+  }
+`
+
+// 3
+export default graphql(ADD_MUTATION, { name: 'addLink' })(AddLink)
-export default AddLink
```

## Creating links in our app

App.js

```diff
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Links from './Links'
+import AddLink from './AddLink'

class App extends Component {
  render() {
    return (
+      <div>
+        <AddLink />
        <Links />
+      </div>
    );
  }
}

export default App;


```