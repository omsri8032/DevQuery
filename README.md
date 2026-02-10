<p align="center">
  <img src="public/icons/question (1).png" alt="Dev Query Logo" width="100" />
</p>

<h1 align="center">Dev Query - Community Knowledge Platform</h1>

###

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" height="40" alt="NextJS" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="React" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" alt="TypeScript" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" height="40" alt="Tailwind" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/appwrite/appwrite-original.svg" height="40" alt="Appwrite" />
</div>

###

**Dev Query** is a modern, full-stack Q&A platform tailored for developers. It enables users to ask questions, share knowledge, and engage with a community through a reputation-based system. Built with performance and scalability in mind, it leverages **Next.js** for the frontend and **Appwrite** as a secure Backend-as-a-Service (BaaS).

---

## ✨ Features

- 💬 **Q&A System**: Post questions, write answers, and engage in threaded discussions.
- 🗳️ **Voting Mechanism**: Upvote or downvote content to bubble up the best solutions.
- 📝 **Markdown Support**: Robust text editor with syntax highlighting for developer-friendly posts.
- 🏷️ **Tagging System**: Categorize questions for easy discovery and filtering.
- 🎨 **Modern Interface**: Glassmorphism design with premium animated backgrounds and dark mode support.
- 🔍 **Global Search**: Instant, URL-syncing search to find relevant topics quickly.
- 🔐 **Secure Auth**: Robust login and session management powered by Appwrite.
- 📱 **Responsive Design**: Optimized for seamless experience across mobile, tablet, and desktop.

---

## �️ Screenshots

### Dashboard & Feed
| | |
|:---:|:---:|
| ![Feed](public/ss/ss-01.png) | ![Dark Mode](public/ss/ss-02.png) |
| ![Sidebar](public/ss/ss-05.png) | ![Right Sidebar](public/ss/ss-06.png) |

### Question & Answers
| | |
|:---:|:---:|
| ![Question Detail](public/ss/ss-03.png) | ![Comments](public/ss/ss-07.png) |
| ![Voting](public/ss/ss-08.png) | ![Rich Text Editor](public/ss/ss-12.png) |

### User Profile & Settings
| | |
|:---:|:---:|
| ![Profile](public/ss/ss-04.png) | ![Edit Profile](public/ss/ss-09.png) |
| ![Settings](public/ss/ss-10.png) | ![Collection](public/ss/ss-11.png) |

### Authentication & Mobile
| | |
|:---:|:---:|
| ![Login/Register](public/ss/ss-13.png) | ![Mobile Menu](public/ss/ss-14.png) |

---

## �️ Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Untitled UI (Design System)

**Backend:**
- Appwrite (Auth, Database, Storage)

**State Management:**
- Zustand

---

## 🧑‍💻 Target Users

- 💻 **Developers**: From beginners to experts looking to solve bugs and share knowledge.
- 🎓 **Students**: Learning to code and needing help with assignments or concepts.
- 🤝 **Open Source Contributors**: discussin implementation details and best practices.
- 🌐 **Tech Enthusiasts**: Keeping up with the latest trends and technologies.

---

## 🏗️ Architecture

```mermaid
graph TD
    User["User (Browser)"]

    subgraph Frontend["Next.js Application"]
        UI["UI Components (Tailwind)"]
        Pages["Pages (App Router)"]
        Store["State (Zustand)"]

        User -->|Interacts| UI
        UI -->|Composes| Pages
        Pages -->|Updates/Reads| Store
    end

    subgraph Backend["Appwrite Cloud"]
        Auth["Authentication"]
        DB["Database (Questions/Votes)"]
        Storage["Storage (Images)"]

        Store -->|Session| Auth
        Pages -->|CRUD| DB
        UI -->|Load Assets| Storage
    end

    subgraph DataFlow["Data Flow"]
        direction TB
        Auth -.->|Profile| User
        DB -.->|Content| Pages
    end
```

---

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/qna-system.git
    cd qna-system
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file with your Appwrite credentials:
    ```env
    NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
    NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to see the app.
