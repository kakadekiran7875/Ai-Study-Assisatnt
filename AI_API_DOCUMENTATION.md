# 🤖 AI Features API Documentation

## Overview
Your AI Study Assistant backend now includes powerful AI features powered by OpenAI GPT models!

## 🔑 Setup Required

### 1. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)
5. Add to `.env` file:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

### 2. Get Supabase Anon Key
1. Go to https://supabase.com/dashboard/project/qzhhekukwoqltqxrwxlx/settings/api
2. Copy the "anon public" key (starts with `eyJ...`)
3. Add to `.env` file:
   ```
   SUPABASE_ANON_KEY=eyJ...your-key-here
   ```

### 3. Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## 📡 API Endpoints

All AI endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-access-token>
```

### 1. Generate Notes 📝

**Endpoint:** `POST /api/ai/generate-notes`

**Description:** Generate comprehensive study notes from any text content.

**Request Body:**
```json
{
  "content": "Your text content here...",
  "subject": "Mathematics" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notes generated successfully",
  "data": {
    "title": "Introduction to Calculus",
    "keyPoints": [
      "Derivatives measure rate of change",
      "Integrals calculate area under curves"
    ],
    "summary": "Detailed summary of the content...",
    "terms": [
      {
        "term": "Derivative",
        "definition": "The rate at which a function changes..."
      }
    ]
  }
}
```

**Example (PowerShell):**
```powershell
curl -X POST http://localhost:5000/api/ai/generate-notes `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -d '{\"content\":\"Calculus is the study of change...\",\"subject\":\"Mathematics\"}'
```

---

### 2. Generate Quiz 🎯

**Endpoint:** `POST /api/ai/generate-quiz`

**Description:** Create multiple-choice quiz questions from study material.

**Request Body:**
```json
{
  "content": "Your study material...",
  "questionCount": 5,        // Optional, default: 5
  "difficulty": "medium"     // Optional: easy, medium, hard
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quiz generated successfully",
  "data": {
    "questions": [
      {
        "question": "What is the derivative of x²?",
        "options": ["A) 2x", "B) x", "C) x²", "D) 2"],
        "correctAnswer": "A",
        "explanation": "Using the power rule..."
      }
    ]
  }
}
```

---

### 3. Summarize Content 📄

**Endpoint:** `POST /api/ai/summarize`

**Description:** Summarize long text into concise points.

**Request Body:**
```json
{
  "content": "Long text to summarize...",
  "maxLength": 200  // Optional, default: 200 words
}
```

**Response:**
```json
{
  "success": true,
  "message": "Content summarized successfully",
  "data": {
    "summary": "Concise summary of the content..."
  }
}
```

---

### 4. AI Chat Assistant 💬

**Endpoint:** `POST /api/ai/chat`

**Description:** Chat with an AI study assistant for help with homework and concepts.

**Request Body:**
```json
{
  "message": "Can you explain photosynthesis?",
  "conversationHistory": [  // Optional
    {
      "role": "user",
      "content": "Previous message..."
    },
    {
      "role": "assistant",
      "content": "Previous response..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI response generated",
  "data": {
    "response": "Photosynthesis is the process by which plants..."
  }
}
```

---

### 5. Extract Text from Image 📷

**Endpoint:** `POST /api/ai/extract-text`

**Description:** Extract text from images (OCR) and generate notes.

**Request Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Text extracted successfully",
  "data": {
    "extractedText": "Text found in the image..."
  }
}
```

**Note:** Requires GPT-4 Vision model. This is a premium feature.

---

### 6. Generate Flashcards 🗂️

**Endpoint:** `POST /api/ai/generate-flashcards`

**Description:** Create flashcards for effective studying.

**Request Body:**
```json
{
  "content": "Study material...",
  "cardCount": 10  // Optional, default: 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Flashcards generated successfully",
  "data": {
    "flashcards": [
      {
        "front": "What is mitochondria?",
        "back": "The powerhouse of the cell"
      }
    ]
  }
}
```

---

## 🧪 Testing the API

### Step 1: Register a User
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\"}'
```

Save the `token` from the response.

### Step 2: Test AI Features
```powershell
# Generate Notes
curl -X POST http://localhost:5000/api/ai/generate-notes `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_TOKEN_HERE" `
  -d '{\"content\":\"The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.\",\"subject\":\"Mathematics\"}'
```

---

## 💰 OpenAI Pricing

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens (very affordable)
- **GPT-4**: ~$0.03 per 1K tokens (premium)
- **GPT-4-vision**: ~$0.01 per image

**Tip:** Start with GPT-3.5-turbo for cost-effective testing!

---

## 🔒 Security Notes

- ✅ All AI endpoints are protected (require authentication)
- ✅ Rate limiting is enabled (100 requests per 15 minutes)
- ✅ API keys are stored in environment variables
- ⚠️ Never commit `.env` file to Git
- ⚠️ Keep your OpenAI API key secret

---

## 🐛 Troubleshooting

**"OpenAI API key not found"**
→ Add `OPENAI_API_KEY` to your `.env` file

**"Insufficient quota"**
→ Add credits to your OpenAI account at https://platform.openai.com/account/billing

**"Not authorized"**
→ Make sure you're sending the JWT token in the Authorization header

**"Rate limit exceeded"**
→ Wait 15 minutes or increase the rate limit in `.env`

---

## 📚 Integration with Flutter App

In your Flutter app, you can call these endpoints like this:

```dart
// Example: Generate Notes
Future<Map<String, dynamic>> generateNotes(String content, String subject) async {
  final response = await http.post(
    Uri.parse('$baseUrl/api/ai/generate-notes'),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: jsonEncode({
      'content': content,
      'subject': subject,
    }),
  );
  
  return jsonDecode(response.body);
}
```

---

## 🎯 Next Steps

1. ✅ Get your OpenAI API key
2. ✅ Get your Supabase anon key
3. ✅ Update `.env` file
4. ✅ Restart server
5. ✅ Test the endpoints
6. ✅ Integrate with Flutter app

---

**Your AI Study Assistant backend is now fully equipped with AI superpowers!** 🚀
