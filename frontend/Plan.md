You are building a prototype web app for a simple Q&A chat system.

## 1. App overview
The app has 2 user roles:
- Normal user (Question asker)
- Leadership Team (Answerer – LT)

There is NO real authentication system.
All data is stored in browser localStorage only (threads, comments, user role).

## 2. Screens
### Screen 1: Main Screen
- Display app logo: HNK_Logo_dark.png
- Two main buttons:
  1. "Ask a Question"
  2. "Answer (LT only)"
- If user clicks "Answer", show a password prompt.
  - Correct credentials:
    - username: ltteam
    - password: apachub
- If correct → enter app as Leadership Team -> Every answer would have a tag (LT) next to the username.
- If blank username and password, it would be normal user answer → 

### Screen 2: Chat Screen
- Each question is a thread.
- Users can:
  - Create a new question (title + content)
  - View list of existing threads
  - Click into a thread to see comments
  - Add comments to a thread
- Leadership Team can reply to any thread.

## 3. Data & State
- Use localStorage for:
  - Threads
  - Comments
  - User role (normal or LT)
- No backend, no database, no API.
- Keep data structure simple and readable.

## 4. UI / UX Requirements
- Fully responsive (mobile + desktop).
- Simple, clean layout inspired by Reddit / Threads:
  - Vertical thread list
  - Clear separation between questions and replies
- Easy to read, user-friendly, minimal UI.

## 5. Theme & Styling
- Default theme: Dark mode ONLY.
- Prepare for future light mode but DO NOT implement it yet.
  - Add placeholder structure in index.css for light mode.

### Colors:
- Background: #000000 (black)
- Primary button:
  - Background: green #13670B
- Text:
  - White: #FFFFFF

### General style:
- Elegant
- Minimal
- Modern
- No unnecessary animations
- Reddit/Threads style

## 6. Technical Notes
- Frontend only (React typescript)
- Use clean component structure.
- Clear separation of components:
  - Main screen
  - Chat screen
  - Thread
  - Comment
- Keep code readable and easy to extend later.
- Setup index.css for repetitive styles.
- Typography: Inter, system-ui, sans-serif
## 7. Non-goals (DO NOT do)
- No signup / registration yet
- No backend yet
- No real authentication yet
- No light mode implementation yet
- No complex permissions yet

Build this as a working prototype, focusing on clarity, simplicity, and speed.
