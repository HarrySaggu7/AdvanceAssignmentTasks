# React Native Assignments Portfolio

A collection of React Native applications demonstrating various concepts and techniques.

## 📋 Table of Contents

- [Overview](#-overview)
- [Tasks Completed](#-tasks-completed)
- [Getting Started](#-getting-started)
- [Technologies Used](#-technologies-used)
- [Assignment Details](#-assignment-details)

## 🎯 Overview

This repository contains 5 React Native assignments, each focusing on different aspects of mobile development:

1. News Reader with Pagination and Caching
2. Secure Login with JWT Authentication
3. Weather Dashboard with Geolocation
4. Product List with Search and Filtering
5. Expense Tracker with Local Database

## 📱 Tasks Completed

### Task 1: News Reader App

**Location**: `/Task-1-News-Reader/`

- **Features**: Paginated news list, pull-to-refresh, caching with AsyncStorage
- **Concepts**: API integration, pagination, caching, loading states
- **API**: NewsAPI

### Task 2: Secure Login App

**Location**: `/Task-2-Secure-Login/`

- **Features**: JWT authentication, secure token storage, protected screens
- **Concepts**: Authentication, encryption, conditional navigation
- **API**: ReqRes.in (mock API)

### Task 3: Weather Dashboard

**Location**: `/Task-3-Weather-Dashboard/`

- **Features**: Geolocation, current weather display, skeleton loading
- **Concepts**: Permissions, geolocation API, caching, performance optimization
- **API**: OpenWeatherMap API

### Task 4: Product List App

**Location**: `/Task-4-Product-List/`

- **Features**: Search, category filtering, infinite scroll, performance optimizations
- **Concepts**: FlatList optimization, search algorithms, TypeScript
- **API**: DummyJSON API

### Task 5: Expense Tracker

**Location**: `/Task-5-Expense-Tracker/`

- **Features**: Local database, charts, backup/restore functionality
- **Concepts**: SQLite, data visualization, file system operations
- **Database**: SQLite

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- React Native CLI
- iOS Simulator (for Mac users) or Android Studio

### Running a Specific Task

1. **Navigate to the task directory**:

   ```bash
   cd Task-4-Product-List/

   ```

2. Install dependencies:

   bash
   npm install

3. Run the application:
   bash

   # For iOS

   npx react-native run-ios

   # For Android

   npx react-native run-android

Running All Tasks

Each task is a separate React Native project. Navigate to any task directory and follow the steps above.

## 🛠️ Technologies Used
Framework: React Native

Language: TypeScript

State Management: React Hooks (useState, useEffect, useCallback, useRef)

HTTP Client: Axios

Navigation: React Navigation (where applicable)

Storage: AsyncStorage, SQLite

UI Components: React Native core components

## 📚 Assignment Details
Each task demonstrates specific React Native concepts:

Core Concepts Covered

✅ Component lifecycle management

✅ State and props management

✅ API integration and data fetching

✅ User input handling

✅ Navigation patterns

✅ Performance optimization

✅ Error handling

✅ TypeScript implementation

Advanced Techniques
Custom hooks creation

Performance optimization (memoization, lazy loading)

Secure storage practices

Geolocation integration

Local database management

Chart integration and data visualization

