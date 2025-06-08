SmartStudy
An AI-powered study assistant that helps transform PDFs and notes into interactive study materials.

Features
📚 PDF Upload & Processing
🤖 AI-Powered Summary Generation
📝 Interactive Flashcards
📤 Export to Markdown/Anki
🌙 Dark/Light Mode
🔄 Real-time Updates
Tech Stack
Frontend: Next.js 13+, TypeScript, Tailwind CSS
Backend: Node.js, Express, TypeScript
Database: MongoDB
AI Integration: OpenRouter API
Container: Docker
Prerequisites
Node.js 18+
pnpm
Docker & Docker Compose
MongoDB (or use Docker)
Local Development
Clone the repository:
git clone https://github.com/shyamr54/StudySmartBuddy.git
cd StudySmartBuddy
Install dependencies:
# Install client dependencies
cd client
pnpm install

# Install server dependencies
cd ../server
pnpm install
Set up environment variables:
Create .env file in server directory:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/studysmartbuddy
NODE_ENV=development
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_api_key_here
Create .env.local file in client directory:

NEXT_PUBLIC_API_URL=http://localhost:5000/api
Start the development environment:
Using Docker:

docker-compose up
Without Docker:

# Start MongoDB (if not using Docker)
mongod

# Start server (in server directory)
pnpm dev

# Start client (in client directory)
pnpm dev
Access the application:
Frontend: http://localhost:3000
Backend API: http://localhost:5000
API Health Check: http://localhost:5000/api/health