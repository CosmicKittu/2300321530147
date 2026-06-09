# how to run this application

- make a .env file and add credential in notification_app_be
- run npm install
- run node index.js 





# Stage 1
## Api end point
```
GET    /notifications
GET    /notifications/:id
POST   /notifications
PATCH  /notifications/:id/read
PATCH  /notifications/read-all
DELETE /notifications/:id
```

## Response

### GET    /notifications

```json
{
	"notifications": [
		{
			"id": "7cc4947d-6086-48e5-a5a9-e4d3a0acdd92",
			"type": "Result",
			"message": "hello",
			"timestamp": "2026-06-09T07:32:12.832Z",
			"read": false
		}
	]
}
```

### POST   /notifications

```json
{
	"id": "5825f293-d96e-4bf7-8484-3ca176e5aae0",
	"type": "Result",
	"message": "hello",
	"timestamp": "2026-06-09T07:37:02.379Z",
	"read": false
}
```

# stage 2



## Database Choice

I have chosen SQLite as the persistent storage solution.

Reasons:

- Lightweight and easy to set up.
- Does not require a separate database server.
- Suitable for small to medium-sized applications.
- Stores data persistently in a local database file.
- Ideal for rapid development and evaluation purposes.

## Database Schema

```sql
id TEXT PRIMARY KEY,
type TEXT NOT NULL,
message TEXT NOT NULL,
is_read INTEGER DEFAULT 0,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```