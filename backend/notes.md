Browser / React / HTTP client
          |
          | HTTP request: method + URL + headers + optional body
          v
Node.js process running Express
          |
          | Application rules; optional database or external service
          v
HTTP response: status + headers + optional body
          |
          v
Client decides what to display















```http
POST /api/tasks HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{"title":"Practice Express"}
```

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: /api/tasks/example-id

{"data":{"id":"example-id","title":"Practice Express","completed":false}}
```










| Method | Meaning in this class | Example | Success |
|---|---|---|---|
| GET | Read a collection or item | `/api/tasks`, `/api/tasks/task-1` | 200 |
| POST | Create a task in the collection | `/api/tasks` | 201 |
| PATCH | Change specified task fields | `/api/tasks/task-1` | 200 |
| DELETE | Remove a task | `/api/tasks/task-1` | 204 |




| Status | Meaning here | Example |
|---|---|---|
| 200 | Successful read or update | List or PATCH result |
| 201 | Created | Successful POST |
| 204 | Successful response without content | Successful DELETE |
| 400 | Request data is invalid | Bad title, invalid query, malformed JSON |
| 404 | Resource or route not found | Unknown task or URL |
| 413 | Body exceeds the size limit | JSON larger than 10 KB |
| 415 | Unsupported request media type or encoding | Text sent to a JSON-only mutation route |
| 500 | Unexpected server failure | Missing prepared file or programming error |









```text
React form draft
  -> event handler awaits Axios POST
  -> HTTP request with JSON body
  -> Express parser and validation
  -> server creates task and ID
  -> HTTP 201 + JSON body
  -> Axios promise resolves
  -> React stores confirmed task and clears draft
  -> next render displays task
```