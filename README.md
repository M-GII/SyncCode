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
git clone https://github.com/M-GII/SyncCode.git
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
WS_TOKEN_SECRET=your_websocket_token_secret
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

1. The Next.js app verifies the user's Better Auth session.
2. A short-lived WebSocket token is issued for the requested project.
3. The WebSocket server verifies the token and extracts the user and project IDs.
4. The server checks the `ProjectMember` table.
5. The WebSocket upgrade is allowed only if the user belongs to the project.

This prevents unauthorized users from connecting to collaborative rooms they do not have access to.

---

## Real-Time Collaboration

Each project uses its project ID as its unique Yjs document name:

* **Project A** -> Yjs document A
* **Project B** -> Yjs document B

Users connected to the same project synchronize changes through the WebSocket server while remaining completely isolated from other projects. Yjs awareness is also utilized to display which users are currently online and active in the workspace.

---

## Database Models

The application manages authentication, user sessions, project access, and chat history using Prisma with PostgreSQL:

* **`user`**: Stores user credentials, email verification status, and profile information. Linked to accounts, sessions, project memberships, and chat messages.
* **`account`**: Manages OAuth and auth providers linked to users, supporting tokens and expiration metrics.
* **`session`**: Tracks active authenticated user sessions, expiration timestamps, IP addresses, and user agents.
* **`verification`**: Handles authentication tokens and verification values.
* **`Project`**: Stores project metadata, target programming language (`typescript` by default), unique invite code, and owner references.
* **`ProjectMember`**: Joins `user` and `Project` with explicit roles (`owner` or `editor`) to enforce workspace permissions.
* **`Message`**: Stores persistent real-time chat messages tied to specific projects and users with indexed timestamps.

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
