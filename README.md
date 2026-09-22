# MovieChat

A movie recommendation chatbot built with React and Node.js.

## Running Locally

The easiest way to run MovieChat is with Docker.

1. **Set your API Key**  
   Create a `.env` file in the `backend` directory (you can copy `.env.example`) and add your `TMDB_API_KEY`.

2. **Start the app**  
   ```bash
   docker-compose up --build
   ```

- **Frontend:** http://localhost:8080
- **Backend:** http://localhost:5000

## Jenkins CI/CD

To run the Jenkins pipeline locally:

```bash
docker build -t moviechat-jenkins -f Jenkins.Dockerfile .
docker run -d -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v //var/run/docker.sock:/var/run/docker.sock --name moviechat_jenkins moviechat-jenkins
```

## Render Deployment

To deploy this project to Render as separate Web Services:

1. **Backend Web Service**
   - **Environment:** Docker
   - **Source Directory:** `backend`
   - **Environment Variables:**
     - `TMDB_API_KEY`: Your TMDB API key
     - `FRONTEND_URL`: `https://your-frontend-url.onrender.com` (to restrict CORS, or omit to allow all)

2. **Frontend Web Service**
   - **Environment:** Docker
   - **Source Directory:** `frontend`
   - **Environment Variables:**
     - `BACKEND_URL`: `https://your-backend-url.onrender.com` (your backend Render URL, without trailing slash or `/api`)

The frontend Nginx container automatically sanitizes `BACKEND_URL` and routes `/api/*` requests to your backend at runtime with SSL/SNI support.
