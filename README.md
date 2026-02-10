# Dev Query

**Dev Query** is a modern, full-stack Q&A platform tailored for developers. It enables users to ask questions, share knowledge, and engage with a community through a reputation-based system.

Built with performance and scalability in mind, it leverages **Next.js 14** for the frontend and **Appwrite** as a secure Backend-as-a-Service (BaaS).

---

## 🛠️ Tech Stack

**Core Framework**
*   ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) **Next.js 16** (App Router)
*   ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) **React 19**
*   ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) **TypeScript**

**Styling & UI**
*   ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS**
*   **Aceternity UI** (Animated components like Background Beams, Spotlight)
*   **Lucide React** (Icons)
*   **Radix UI** (Accessible primitives)

**Backend & State**
*   ![Appwrite](https://img.shields.io/badge/Appwrite-%23FD366E.svg?style=for-the-badge&logo=appwrite&logoColor=white) **Appwrite** (Auth, Database, Storage)
*   **Zustand** (Global State Management)

**Editor**
*   **@uiw/react-md-editor** (Markdown support)

---

## 🏗️ Architecture

```mermaid
graph TD
    User["User (Browser)"]
    
    subgraph Frontend["Next.js Application"]
        UI["UI Components (Tailwind/Aceternity)"]
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

## 📸 Screenshots

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

## ✨ Key Features

1.  **Authentication**: Secure Email/Password login flows via Appwrite.
2.  **Real-time Q&A**: Post questions and answers instantly.
3.  **Rich Text Editing**: Full Markdown support for code snippets and formatting.
4.  **Reputation System**: Upvote/Downvote to surface the best community content.
5.  **Smart Search**: URL-based search filtering for easy sharing.
6.  **Modern Design**: Dark mode support, animated backgrounds, and responsive layouts.

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
