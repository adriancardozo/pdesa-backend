# Backend (Prácticas de desarrollo)

## Start backend project locally

Install dependencies:

```bash
npm install
```

Install development hooks:

```bash
npm run prepare
```

Copy `.env.example` file and rename to `.env`.
Then complete whit environment values

```bash
ML_CLIENT_ID=<ML_client_id>
ML_CLIENT_SECRET=<ML_client_secret>
ML_URL=https://api.mercadolibre.com
ML_ACCESS_TOKEN=<ML_access_token> # (without Bearer)
ML_REFRESH_TOKEN=<ML_refresh_token>
MSSQL_HOST=<mssql_server_url>
MSSQL_PORT=<mssql_server_port> # (default value is 1433)
MSSQL_USER=<mssql_username>
MSSQL_PASSWORD=<mssql_password>
MSSQL_DB=<mssql_db_name>
MSSQL_SYNCHRONIZE=true
MSSQL_LOGGING=false
MSSQL_ENCRYPT=false
MSSQL_TRUST_CERT=true
JWT_SECRET=<jwt_secret>
```

Start project

```bash
npm start
```

And then go to http://localhost:3000/docs to open Swagger UI

## Start backend project using docker

Build image using the following command

```bash
docker build --pull --rm -f 'dockerfile' -t 'pdesa-backend:latest' '.'
```

Copy `.env.example` file and rename to `.env`.
Then complete whit environment values

```bash
ML_CLIENT_ID=<ML_client_id>
ML_CLIENT_SECRET=<ML_client_secret>
ML_URL=https://api.mercadolibre.com
ML_ACCESS_TOKEN=<ML_access_token> # (without Bearer)
ML_REFRESH_TOKEN=<ML_refresh_token>
MSSQL_HOST=<mssql_server_url>
MSSQL_PORT=<mssql_server_port> # (default value is 1433)
MSSQL_USER=<mssql_username>
MSSQL_PASSWORD=<mssql_password>
MSSQL_DB=<mssql_db_name>
MSSQL_SYNCHRONIZE=true
MSSQL_LOGGING=false
MSSQL_ENCRYPT=false
MSSQL_TRUST_CERT=true
JWT_SECRET=<jwt_secret>
```

Create a container from this image

```bash
docker run -p "3000:3000" --env-file ".env" pdesa-backend
```

And then go to http://localhost:3000/docs to open Swagger UI

## Start entire project using docker compose

Clone both backend and frontend repositories into same directory

```bash
git clone https://github.com/adriancardozo/pdesa-backend.git
git clone https://github.com/adriancardozo/pdesa-frontend.git
# ./
#  | pdesa-backend/
#  | pdesa-frontend/
```

Move to backend folder

```bash
cd pdesa-backend/
```

Copy docker-compose.yml.example file into a new docker-compose.yml file and set secret environment variables

<blockquote>
<b>NOTE</b>
<p>If you want test latest production images copy <code>docker-compose.production.yml.example</code> into <code>docker-compose.production.yml</code> instead, run <code>docker compose -f 'docker-compose.production.yml' pull</code> and follow the same steps</p>
</blockquote>

```yml
# ...
x-ml: &ml-config
  ML_CLIENT_ID: '<ML_client_id>'
  ML_CLIENT_SECRET: '<ML_client_secret>'
  ML_URL: 'https://api.mercadolibre.com'
  ML_ACCESS_TOKEN: '<ML_access_token>' # (without Bearer)
  ML_REFRESH_TOKEN: '<ML_refresh_token>'
# ...
```

Build images and run containers running the following command

```bash
docker compose -f 'docker-compose.yml' up -d --build
```

And then go to http://localhost to open frontend or http://localhost:3000/docs to open backend Swagger UI

### App usage

To use app you will need log in with username and password. You can use following test credentials for this:

**Purchaser credentials**
* Username: `purchaser`
* Password: `Purchaser1234!`

**Administrator credentials**
* Username: `admin`
* Password: `Admin1234!`

<blockquote>
<b>NOTE</b>
<p>If you want test backend use <code>/auth/login</code> endpoint with above credentials and then copy response <code>access_token</code> attribute value, click on padlock button and paste into popup input. Then click <code>Authorize</code> button and close popup.</p>
<p>If you want test frontend you will be automatically redirected to login page when you access frontend url. You can also use the credentials mentioned above there.</p>
</blockquote>
