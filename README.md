# College Discovery Platform

A full-stack college discovery platform built with **Next.js, React, TypeScript, PostgreSQL, and Prisma**. The platform helps users discover, search, filter, compare, and save colleges through a clean and responsive interface.

## 🚀 Features

### 🔍 College Search & Discovery
- Search colleges by name
- Filter and sort colleges
- Server-side pagination
- View colleges with structured information
- Efficient database-backed queries

### 🏫 College Details
- College overview
- Courses and programs
- Placement information
- Reviews
- Structured college data

### ⚖️ Compare Colleges
- Compare **2–4 colleges** side by side
- View key information across selected colleges
- Saved comparisons use live database data

### 🔐 Authentication
- User registration and login
- Credentials-based authentication
- JWT-based sessions
- Protected routes and API endpoints
- Secure password handling

### ❤️ Saved Colleges
- Save and unsave colleges
- View saved colleges
- Persist saved items for authenticated users

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- TailwindCSS

### Backend
- Next.js App Router
- REST APIs
- NextAuth
- Zod

### Database
- PostgreSQL
- Prisma ORM

### Development
- Node.js
- Git
- GitHub

---

## 🏗️ Architecture

The application follows a database-driven full-stack architecture:

```text
                    ┌─────────────────────┐
                    │      Next.js UI     │
                    │  React + TypeScript │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     REST APIs       │
                    │  Next.js App Router │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Prisma ORM       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    └─────────────────────┘
