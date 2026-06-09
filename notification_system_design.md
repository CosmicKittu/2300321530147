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

```
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