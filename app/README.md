Manage Contracts app is SPA that shows a list contracts and manage them:

The admin tool:
   ● A list of insurance contracts
      ○ Data:
         ■ Premium
         ■ Start date
         ■ Potential termination date

   ● Actions:
      ○ The ability to create a contract
      ○ The ability to terminate a contract


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

To run the docker/container server:
First update your environment variables in docker-compose.yml file.
 you can run docker-compose commands:

```bash
#1- build/rebuild the docker image
docker-compose build

#2- Run the docker/container
docker-compose up 

#3- To stop the docker/container and clean up the network
docker-compose down
```

To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/](http://localhost:3000/api/). These endpoints can be edited in `pages/api/place.ts` and `pages/api/places.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

