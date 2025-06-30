# DentalMentor - Interactive Dental Education Platform

![DentalMentor Banner](https://images.pexels.com/photos/3845757/pexels-photo-3845757.jpeg?auto=compress&cs=tinysrgb&w=1200)

## Overview

DentalMentor is a cutting-edge interactive dental education platform that combines AI-powered learning, 3D simulations, and collaborative tools to revolutionize how dental professionals master their craft.

## Key Features

- **Interactive Learning Modules**: Master dental procedures with 3D simulations and step-by-step guidance
- **AI-Powered Dental Mentor**: Get instant answers and guidance from our specialized dental AI
- **Collaborative Study Groups**: Join peers in real-time sessions to discuss cases and share knowledge
- **Gamified Progress Tracking**: Earn XP, badges, and climb the leaderboard as you advance your skills
- **AR/VR Learning Experiences**: Practice procedures in immersive virtual environments
- **Live Events & Webinars**: Participate in expert-led sessions on cutting-edge dental topics

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **3D Rendering**: Three.js, React Three Fiber
- **Backend**: Node.js, Express, MongoDB
- **AI Integration**: Google Gemini AI
- **Real-time Communication**: Socket.io
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/dental-mentor.git
   cd dental-mentor
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration

4. Start the development server
   ```
   npm run dev
   ```

5. Start the backend server
   ```
   npm run server
   ```

## Project Structure

```
dental-mentor/
├── public/              # Static assets
├── server/              # Backend server code
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   └── index.js         # Server entry point
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API and service integrations
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
└── README.md            # Project documentation
```

## Features in Detail

### Interactive Learning Modules

- 3D simulations of dental procedures
- Step-by-step guidance with real-time feedback
- Comprehensive coverage of all dental specialties

### AI-Powered Dental Mentor

- Instant answers to dental questions
- Personalized learning recommendations
- Procedure analysis and feedback

### Collaborative Study Groups

- Real-time chat and video sessions
- Case study discussions
- Peer-to-peer learning opportunities

### Gamified Progress Tracking

- Experience points (XP) for completed activities
- Achievement badges for mastering skills
- Global and specialty-specific leaderboards

### AR/VR Learning Experiences

- Immersive dental procedure practice
- Realistic tooth preparation simulations
- Virtual patient interactions

## Contributing

We welcome contributions to DentalMentor! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact us at support@dentalmentor.com