<h3 align="center">Microservices Example - Cloud Deployment</h3>
  <p align="center">
    This is a contination of <a src="readme.md">readme.md</a> with instructions to deploy the app to the cloud. We are using <strong>DigitalOcean</strong> but it can be easily ported to Google, AWS, or the cloud of your choice.
  </p>
</div>

# Overview

GitHub workflows will perform testing and deploying of the app. When a service is modified and then synchronized to the `master` repository the tests for that service will be run. If the tests are successful, the service will be deployed to the cloud.

## DigitalOcean setup

- Sign up at [DigitalOcean](https://www.digitalocean.com)
- Note: Search for a coupon which will give you a credit
- Navigate to the Dashboard
- Create a cluster. Click `Create` at top of page. Select `Cluster`
- Choose default Kubernetes version
- Choose a datascenter region. Select one closest to you.
- VPC Netork. Select default.
- Cluster Capacity. Select Standard Nodes, $10/mo, number of nodes = 3
- Choose a name. Enter a relevant name, i.e. `ticketing`
- Create Cluster. Will take time to create cluster. Be patient.
- For testing this will run about $40/mo. 3 nodes for services plus 1 node for a load balancer.

## Connect to Cluster from local machine via Kubectl

We ard doing this so we can test and debug with the cloud cluster. We can use kubectl commands to view logs, get list of running pods etc. We will NOT deploy manually. We will use GitHub Workflow Actions to do this.

- Navigate to you Dashboard at DigitalOcean and select your cluster
- Select Kubernetes from side menu
- Follow instructions to install `doctl`
- Generate a Api Token
  - Select Api from side menu
  - Click generate token; Give it a name.
  - Copy the token
- Go to Terminal and connect
  - `run:` doctl auth init
  - You will be prompted for token from above
- Commands
  - `run:` doctl kubernetes cluster kubeconfig save <your cluster name>
  - You will receive a confirmation that this is done
  - It will set the kubernetes context to this new cluster.
  - Note: With DockerDesktop you should now see Kubernetes now connected to your cluster
  - `run:` kubectl get pods. You should see nothing running even if you are running these on your local machine.
  - `run:` kubectl get nodes. You shoudl see a list of 3 nodes from DigitalOcean.
- Manually switch context
  - `run:` kubectl config view. Lists you contexts
  - `run:` kubectl conig use-context <context_name>
  - note: you can also you DockerDesktop tray menu to switch Kubernetes contexts easily.

## Install secret keys into cluster

These are secret keys derived from Kubernets cluster by app. Identical to procedure you used for these into DockerDesktop but now directed to your cluster in the cloud.

- Make sure you have your `cloud cluster` selected as the Kubernetes cluster
- `run:` kubectl create secret generic jwt-secret --from-literal=JWT_KEY=abcdefg
- `run:` kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<your secret key defined during Stripe install>

## Setup Ingress-Nginx on cloud cluster

- Go to [Ingress-Nginx Installation Guide](https://kubernetes.github.io/ingress-nginx/deploy/#docker-desktop)
- Go to Deployment section
- Go to DigitalOcean section and copy the command provided. It will be something like:

```sh
Example only
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.1/deploy/static/provider/cloud/deploy.yaml
```

- Make sure your Kubectl client is connected to DigitalOcean
- `run:` the command you get from DigitalOcean

## Obtain a public domain name and point it to your cloud cluster

We are going to use [NameCheap](namecheap.com) to acquire a DNS name to test the cloud cluster

- Go to DigitalOcean, sign in and select your cluster
- Select Networking from left menu
- Select Load Balancer and Click on your balancer
- Note the IP Address of the load balancer (listed on the line below the name)
  - This is the ip Address the is the entry to your cluster
- Buy the domain name and point it to the above load balancer
  - We will use NameCheap.com, but you can use any one you desire.
  - I have created `ticketing-art.art` for $1 year.
  - Select `Domain List`. Create a Custom DNS entry with the following 3 entries: ns1.digitalocean.com, ns2.digitalocean.com, ns3.digitalocean.com
  - Return to DigitalOcean Dashboard. Select Networking. Select Domains.
  - Add a Domain. Enter the name you purchased above. For me its `ticketing-art.art`
  - Create an `A Record` pointing it at your Load Balancer, TTL to 30 seconds.
  - Create a `CNAME Record`, "www" is an alias of "@" and TTL to 30 seconds.
- Modify the `ingress-srv.yaml` config to point to the above Domain
  - `edit:` infra/k8s-prod/ingress-srv.yaml.
  - search for 'host:'
  - enter your Domain name as the host: For me it would look like:
  ```sh
  - host: www.ticketing-art.art
  ```
  - save the file
- continue

## GitHub Secrets

The secret information to be used by GitHub workflows

- Go to `settings/secrets/actions` to enter the following

  - DOCKER_USERNAME
  - DOCKER_PASSWORD
  - DIGITALOCEAN_ACCESS_TOKEN

# Commit and push your changes to the `master` branch.

This should kick off a chain of workflows. Check that tests and workflows ran error free. If so, the cluster should up.

- `run:` kubectl get pods.
- you should see all your pods running. See below for an example:

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
