# node-thrift-linkerd

This projects is an example of using [Node.js](http://nodejs.org), [Thrift](http://thrift.apache.org) and [Linkerd](http://linkerd.io) to build a highly performant and resilient RPC service mesh.  

## Background

As many companies start to out grow their MVP or monolithic code base, they often resort to a services architecture to unlock the potential of their growing engineering team.  In many cases they try to adopt at least a couple of runtimes that are well suited tools for different aspects of the services architecture.  

This project is an attempt to evaluate a technology stack targeted at supporting resilient service to service communications across disparate runtimes. The requirements of the services architecture includes:

* Services must publish an API consumable by any runtime
* API must be consumable via code generation
* The communications infrastructure must support all runtimes
* Adding service discovery should be trivial as the architecture grows

## The Stack

Based on the requirements established above, I selected the following stack for my evaluation:

* **NodeJS** - Node was selected as the initial runtime for ease of prototyping and it's non-blocking I/O model.  Most of the code base is built with [TypeScript](https://www.typescriptlang.org) to take advantage of the its' compiler and the types defined in the Thrift IDLs

* **Thrift** - A framework for scalable cross-language RPC based services development.  

* **Linkerd** - Is the core communications layer that includes routing, failure handling, and visibility across the entire service mesh.

* **Namerd** - Which provides service discovery.  Though this project uses a hardcoded configuration, it is easily configurable to use other services like Zookeeper or Consul.

* **GraphQL** - The project includes a [GraphQL](http://graphql.org) Server combined with [Graphiql](https://github.com/graphql/graphiql) to provide an in-browser IDE for exploring the API.
