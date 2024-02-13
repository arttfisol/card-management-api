# Card Management API
This api is compatible with `NodeJS` (version 16) with `ExpressJS` and Database `MongoDB`

## Prerequisite
Required to have `docker` in machine, Below are commands to install `docker`

```
curl -sSL https://get.docker.com/ | sh
```
or
```
wget -qO- https://get.docker.com/ | sh
```

## Step to run

### Clone Repository
1. Clone repository when you are in desired directory
```
git clone git@github.com:arttfisol/card-management-api.git
```
or
```
git clone https://github.com/arttfisol/card-management-api.git
```
1. Change directory to the project
```
cd card-management-api
```
---
### Run Services
1. Create .env file at root of project's directory and put config to it (change config to yours if needed), Below is the example of .env file
```
NODE_ENV=development
PORT=4040
MONGO_HOST=mongodb://mongodb:27017/card_management
JWT_SECRET=secret

```
2. Run command to start services, If you need to use your own mongodb, you can remove `mongodb` from docker-compose services and change env `MONGO_HOST` to your database
```
docker-compose up -d
```

## About API Path
This API using for manage card. For any action to do with `card`, `card comment`, `card change log`, you need to put access token (from login) into header\
Ex. `headers.Authorization` = `Bearer {access_token}`
\
\
For `update` and `delete` card comment, access token must be user that created the comment
\
\
Ps. You can use [card_management_api.postman_collection.json](https://github.com/arttfisol/card-management-api/blob/master/card_management_api.postman_collection.json) to test in postman
## Health-Check
Path for health check service
```
GET /
GET /health-check
```

## Create User

Path for create user to get/create/update/delete card/comment
```
POST /api/users
```
| Body | Description | Required | Example |
| ------------ | ----------- | ------ | ------- |
| `username` | username for login | true | tester@test.com |
| `password` | password for login | true | tQ0uXxXldXMAIfe |
| `name` | user's name | true | Tester01 |
| `picture` | user's picture | false | https://userprofile.com/user_default |

## Login
Path for get access token to get/create/update/delete card/comment information
```
POST /api/auth/login
```
| Body | Description | Required | Example |
| ------------ | ----------- | ------ | ------- |
| `username` | username for login | true | tester@test.com |
| `password` | password for login | true | tQ0uXxXldXMAIfe |

## Card
### Create Card
```
POST /api/cards
```
| Body | Description | Required | Example |
| ------------ | ----------- | ------ | ------- |
| `topic` | topic of card | true | Interview 1 |
| `desc` | description of card | true | Detail of Interview 1 |
| `state` | state of card (can be one of `todo`, `in_progress`, `done`) | true | todo |
---
### List Card
```
GET /api/cards?skip=0,limit=10
```
| Query String | Description | Required | Example |
| ------------ | ----------- | ------ | ------- |
| `skip` | number of result that need to skip (default value is 0)| false | 0 |
| `limit` | maximum number of result that need to return | false | 10 |
---
### Get Card
```
GET /api/cards/{card_id}
```
---
### Update Card
```
PATCH /api/cards/{card_id}
```
| Body | Description | Required | Example |
| ------------ | ----------- | ------ | ------- |
| `topic` | topic of card | true | Interview 1 (Edited) |
| `desc` | description of card | true | Detail of Interview 1 (Edited) |
| `state` | state of card (can be one of `todo`, `in_progress`, `done`) | false | done |
---
### Archive Card
Path for archive card. After archive card, user will no longer see the card from API card list
```
POST /api/cards/{card_id}/archive
```

## Card Change Log
### List Change Log
```
GET /api/cards/{card_id}/change_logs
```
| Query String | Description | Required | Example |
| ------------ | ----------- | ------ | ------- |
| `skip` | number of result that need to skip (default value is 0)| false | 0 |
| `limit` | maximum number of result that need to return | false | 10 |

## Card Comment
### Create Comment
```
POST /api/cards/{card_id}
```
| Body | Description | Required | Example |
| ------------ | ----------- | ------ | ------- |
| `desc` | description of card's comment | true | Comment Description |

---
### List Card Comment
```
GET /api/cards/{card_id}/comments?skip=0,limit=10
```
| Query String | Description | Required | Example |
| ------------ | ----------- | ------ | ------- |
| `skip` | number of result that need to skip (default value is 0)| false | 0 |
| `limit` | maximum number of result that need to return | false | 10 |
---
### Get Card Comment
```
GET /api/cards/{card_id}/comments/{comment_id}
```
---
### Update Card Comment
```
PATCH /api/cards/{card_id}/comments/{comment_id}
```
| Body | Description | Required | Example |
| ------------ | ----------- | ------ | ------- |
| `desc` | description of card's comment | true | Comment Description (Edited) |
---
### Delete Card Comment
```
DELETE /api/cards/{card_id}/comments/{comment_id}
```