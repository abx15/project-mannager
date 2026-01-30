# WorkLedger Hub

![License](https://img.shields.io/github/license/abx15/workledger-hub)
![Build Status](https://img.shields.io/github/actions/workflow/status/abx15/workledger-hub/ci.yml)
![GitHub issues](https://img.shields.io/github/issues/abx15/workledger-hub)
![GitHub stars](https://img.shields.io/github/stars/abx15/workledger-hub)

**WorkLedger Hub** is a professional Project Management and Team Analytics Dashboard built for modern teams. It provides a comprehensive suite of tools to manage projects, track time, analyze team performance, and streamline collaboration.

## 🚀 Features

- **Project Management**: Create, assign, and track projects with ease.
- **Team Analytics**: Visualize team performance with dynamic charts and reports.
- **Time Tracking**: Built-in time tracking for accurate billing and productivity monitoring.
- **Modern UI/UX**: A beautiful, responsive interface built with React, Tailwind CSS, and Radix UI.
- **Dark Mode Support**: Fully integrated dark mode for comfortable viewing.
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices.

## 🛠 Tech Stack

- **Frontend**: [React](https://reactjs.org/) (v18), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Routing**: [React Router](https://reactrouter.com/)

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/abx15/workledger-hub.git
   cd workledger-hub
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🐳 Docker Support

To run the application using Docker:

1. **Build the image**

   ```bash
   docker build -t workledger-hub .
   ```

2. **Run the container**
   ```bash
   docker run -p 8080:80 workledger-hub
   ```

The application will be available at `http://localhost:8080`.

## 📦 Deployment (Vercel)

This project is optimized for deployment on [Vercel](https://vercel.com).

1. Fork this repository.
2. Import the project into Vercel.
3. The included `vercel.json` handles SPA routing automatically.
4. Click **Deploy**.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🛡 Security

For security concerns, please review our [Security Policy](SECURITY.md).

## 💖 Support

If you find this project useful, please consider implementing it in your workflow or sponsoring the author!

[**Sponsor @abx15 on GitHub**](https://github.com/sponsors/abx15)

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Made with ❤️ by [Arun Kumar](https://github.com/abx15)
