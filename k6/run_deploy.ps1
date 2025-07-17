cat k6/script.js | docker run -e BACKEND_URL=https://pdesa-backend-adriancardozo.azurewebsites.net --network pdesa-backend_pdesa --rm -i grafana/k6 run -
