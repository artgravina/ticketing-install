<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">Microservices Example</h3>
  <p align="center">
    A sample app to deploy, and scale an E-Commerce app using  <strong>Microservices</strong> built with Node, React, Docker and Kubernetes.

  </p>
</div>

## About The Project

Microservices are the number one solution for building and scaling out apps that are intended to grow. This app tackles every major issues around microservices head on. From challenges with data replication to confusing unordered event streams, every major challenge of building microservices is covered. This app is based upon the Udemy course `Microservices with Node JS and React - Stephen Grider`. I highly reccommend this course.

## Key Concepts covered

- Architect large, scalable apps using a collection of microservices
- Solve concurrency issues in a distributed systems environment
- Build a Server-Side Rendered React App to render data from your microservices
- Share reusable code between multiple Express servers using custom NPM packages
- Communicate data between services using a lightning-fast event bus
- Deploy a multi-service app to the cloud with Docker and Kubernetes
- Write comprehensive tests to ensure each service works as designed

### Built With

- [Next.js](https://nextjs.org/)
- [React.js](https://reactjs.org/)
- [Express](https://expressjs.com)
- [Node](https://www.npmjs.com/package/node)
- [Mongo]()
- [Mongoose](https://mongoosejs.com/docs/index.html)
- [Jest](https://jestjs.io)
- [Node Nats Streaming](https://www.npmjs.com/package/node-nats-streaming)
- [Docker](https://www.docker.comkuberne)
- [Kubernetes](https://kubernetes.io)
- [Skaffold](https://skaffold.dev)
- [Stripe](https://stripe.com)
- [NPM Package Manager](https://www.npmjs.com/package/npm)
- [DigitalOcean](https://www.digitalocean.com)

# Overview of the app

Sign up, Create a Ticket you want to sell. Another user can find the Ticket and Purchase. Payment for the ticket is through Stripe. The UI is not critical and is bare bones. The main point is the Microservices strategy employed. The app runs locally with `Docker Desktop`. For production it is deployed to the cloud. This app uses `DigitalOcean`, but can easily be ported to AWS, Google Cloud, etc.

# Services

### Auth

SignUp, SignIn, SignOut Users. Uses JasonWebToken and Cookies to provide current user to all services.

### Client

This is the interface to the browser and will route requests to the various microservices.

### Tickets

The CRUD application to handle Tickets the user wants to sell. Creates, Lists, Show, and Updates Tickets.

### Orders

When user purchases a Ticket and Order is created. Lists all user orders, shows an order and deletes it.

### Payments

Provides support for credit card payments using Stripe.

### Expiration

Removes orders that are in purchase cycle that have not been purchased within the specified time period.

### Common

Not a service but the library of common code to be shared by all services. Utilizes NPM Package Manager.

# Concepts

- Each service is independent of all other services. Failure of one service does not impact others. Utilizes and asynchronous strategy.
- Each service maintains own database (`Mongo`). No service shares a database with another service.
- Communication between services is Event driven. Services create publishers and listeners to events. `node-nats-streaming` provides backbone for this.
- Events are controlled thru versioning so that they are processed in the order they are generated eliminating concurrency problems.
- Common code between the services is maintained by the NPM Package Manager. Services include the `common` package into their service.
- Most of code is Typescript with appropriate interfaces.
- Skaffold handles the workflow for building, pushing and deploying code during development on local machine.
- Every service has a Jest Test Suite.
- Code is stored at GitHub. GitHub Workflows control testing and deployment. Each service has a workflow so changes in one workflow don't initiate testing or deployment of all services.
- If a workflow passes its tests it is Deployed to the cloud server.
- Purchases are handled thru Stripe.

# Installation

## Install this app in the directory of your choice

```sh
git clone https://github.com/artgravina/ticketing.git
```

## Install the NPM packages in the following root directories: auth, client, common, expiration, orders, payments

```sh
cd [root directory. i.e auth, payments, etc]
npm install
cd ..
```

## Install Docker

Please note. You must be familiar with Docker and Kubernetes to understand this app.

- Sign up for Docker at `docker.com`.
- Note your Docker Id. Keep it simple i.e. your name or something memorable. You will be using it a lot in the installation. For example mine is: `artgravina`.
- Download and Install Docker for Mac or Windows
- Login to Docker from within the Docker app on your machine. For Mac there is an icon for Docker in the System Bar.
- Verify your Docker installation
- Note: Docker also contains `Kubernetes`.
- Note: The directory `infra` contains all the Docker Deployment and Service files.

## Install Skaffold

Skaffold handles the workflow for building, pushing, and deploying your application. It watches for any code changes.

- Go to `skaffold.com` and follow installation instructions for your machine type.

## Install kubectl. The kubernetes command-line tool

- Go to `skaffold.com` and follow instructions for your machine type.

## Install Ingress-Nginx to create a Load Balancer Service + an Ingress Controller within Kubernetes.

```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.1/deploy/static/provider/cloud/deploy.yaml
```

- see `infra/k8s-dev and infra/k8s-prod` for Ingress config files.

## Enable Kubernetes in Docker Desktop.

- Go to Preferences / Kubernetes.
- Enable Kubernetes.

## Edit hosts file to create a domain name for testing

- This enables us to have multiple projects running with the Kubernetes cluster. Add following line to your hosts file.

```sh
127.0.0.1 ticketing-dev
```

## Nats Streaming Service

This is the service we use to manage the distribution of Events in the app. It is included in Kubernetes cluster via a standard deployment. See `infra\k8s\nats-depl.yaml`.

To verify deployment run the following command and look for `nats-depl-*`.

```sh
kubectl get pods
```

# Start App on local machine

```sh
cd ticketing // root directory
skaffold dev
```

### Wait a few minutes and then run

```sh
kubectl get pods
```

### You should see all of the pods started without errors:

```
NAME                                     READY   STATUS    RESTARTS   AGE
auth-depl-57c964d945-b8xq6               1/1     Running   0          2d
auth-mongo-depl-6b6f97556-jvrbx          1/1     Running   0          3d19h
client-depl-6b98c66569-8phxk             1/1     Running   0          46h
expiration-depl-69d5d5bb59-knf75         1/1     Running   0          2d21h
expiration-redis-depl-55c656669f-sh5mz   1/1     Running   0          3d19h
nats-depl-95f8f556d-9f4s7                1/1     Running   0          3d19h
orders-depl-7b77f87db-rgwwp              1/1     Running   0          2d
orders-mongo-depl-6b554544d8-fqn6b       1/1     Running   0          3d19h
payments-depl-59559589f-h6fqm            1/1     Running   0          2d
payments-mongo-depl-76ffcb78fb-mlpr6     1/1     Running   0          3d19h
tickets-depl-6cf69fc455-x7n9p            1/1     Running   1          2d
tickets-mongo-depl-8546d98f5b-bxzts      1/1     Running   0          3d19h
```

### Run tests for each service

```sh
cd auth
npm run test
cd ../tickets
npm run test
cd ../orders
npm run test
cd ../payments
npm run test
```

### If all tests pass you can then move on to the browser

http://ticketing-dev

- Sign Up
- You will be navigated to Home Page
- Test the app
