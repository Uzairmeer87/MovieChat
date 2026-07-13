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

- **Frontend:** http://localhost:80
- **Backend:** http://localhost:5000

## Jenkins CI/CD

To run the Jenkins pipeline locally:

```bash
docker build -t moviechat-jenkins -f Jenkins.Dockerfile .
docker run -d -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v //var/run/docker.sock:/var/run/docker.sock --name moviechat_jenkins moviechat-jenkins
```
