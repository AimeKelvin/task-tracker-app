# Taskly

A small task tracker built with Next.js, Firebase Authentication, and Cloud Firestore.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add your Firebase web app configuration to `.env.local` before signing in. Restart the dev server after changing environment values.

## Firebase project setup

1. Open the [Firebase console](https://console.firebase.google.com/) and create a project, or select an existing one.
2. In **Project settings → General → Your apps**, add a **Web app**. Register Taskly and copy the Firebase configuration values into `.env.local` using the matching names from `.env.example`.
3. Go to **Build → Authentication → Get started → Sign-in method**. Enable **Email/Password** and save. Enable **Google**, choose a project support email, and save.
4. In **Authentication → Settings → Authorized domains**, make sure `localhost` is listed for local development. Add your deployed app's domain before deploying.
5. Go to **Build → Firestore Database → Create database**. Choose a location and create the database. Do not use public test rules for this app.
6. Open the Firestore **Rules** tab, replace its contents with the project `firestore.rules` file, and click **Publish**. These rules limit each user to their own `users/{uid}/tasks` documents and validate task fields.
7. Start or restart Taskly with `npm run dev`, then open `/signin`. Create an account with email and password, or continue with Google. `/tasks` shows that account's tasks and `/profile` shows the account name and email.

The browser Firebase SDK reads only the `NEXT_PUBLIC_FIREBASE_*` values. Firebase web configuration is intended to be present in a client app; data access is protected by Authentication and the Firestore rules. Do not add service account credentials or private Admin SDK keys to these variables.

## Features

- Email/password account creation and sign-in
- Google sign-in
- Per-user task create, edit, status update, and delete
- Basic profile page with name and email
- Firestore ownership and field validation rules in `firestore.rules`
- Development-only Flute scene at `/flute`
