# SyncCode

SyncCode is a real-time collaborative code editor that allows multiple users to join a shared project, edit code together, see who is online, and communicate through live chat.

The project was built to explore real-time collaboration, WebSocket communication, authentication, database-backed project management, and shared application state.

---

## Features

* Real-time collaborative code editing
* Shared Monaco code editor
* Live user presence
* Real-time project chat
* Project creation and invite codes
* Join projects using an invite code
* Project-specific programming language selection
* Authentication and protected project access
* Project membership validation
* Persistent projects and chat messages
* Responsive project dashboard

---

## Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS, Monaco Editor |
| **Real-Time Collaboration** | Yjs, `y-websocket`, WebSockets |
| **Backend** | Next.js Server Actions, Node.js WebSocket server, Better Auth |
| **Database** | PostgreSQL, Prisma ORM, Supabase |
| **Deployment** | Vercel (Next.js), Render (WebSocket server), Supabase (PostgreSQL) |

---

## Local Development

**1. Clone the repository**
```bash
git clone https://github.com/M-GII/SyncCode
cd SyncCode
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**

Create a `.env.local` file in the root directory:
```env
DATABASE_URL=your_postgresql_database_url
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:1234
```
> **Note:** Do not commit `.env.local` to GitHub.

**4. Set up Prisma**
```bash
npx prisma migrate dev
npx prisma generate
```

**5. Start the Next.js application**
```bash
npm run dev
```
The application will run at `http://localhost:3000`.

**6. Start the WebSocket server**

In a separate terminal window:
```bash
npm run ws-server
```
The WebSocket server will run at `ws://localhost:1234`.

---

## Authentication and Project Security

WebSocket connections are not accepted automatically. When a client attempts to connect to a project, the WebSocket server executes the following sequence:

1. Reads the user's authentication session.
2. Rejects unauthenticated users.
3. Extracts the requested project ID.
4. Checks the `ProjectMember` table.
5. Allows the WebSocket upgrade only if the user belongs to the project.

This prevents unauthorized users from connecting to collaborative rooms they do not have access to.

---

## Real-Time Collaboration

Each project uses its project ID as its unique Yjs document name:

* **Project A** -> Yjs document A
* **Project B** -> Yjs document B

Users connected to the same project synchronize changes through the WebSocket server while remaining completely isolated from other projects. Yjs awareness is also utilized to display which users are currently online and active in the workspace.

---

## Database Models

The application stores core relational data using Prisma to interact with the PostgreSQL database, including:

* Users
* Authentication sessions
* Projects
* Project members
* Project roles
* Invite codes
* Programming languages
* Chat messages

---

## Deployment Architecture

The production application separates the standard web application from the persistent WebSocket process:

* **Vercel:** Next.js frontend, authentication, Server Actions, and Prisma database operations.
* **Render:** Persistent WebSocket / Yjs server.
* **Supabase:** Managed PostgreSQL database.


## Future Improvements

* Persistent collaborative editor documents
* Multi-file projects and integrated file explorer
* Improved collaborative cursor rendering
* Project roles and fine-grained permissions
* Project rename and delete functionality
* Invite code expiration and regeneration
* In-browser code execution support
* Additional editor themes and customization options
