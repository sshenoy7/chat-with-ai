import { google } from '@ai-sdk/google';
import { convertToCoreMessages, streamText } from 'ai';
import axios from 'axios';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log("inside....");

  const result = await streamText({
    model: google('models/gemini-1.5-flash-latest'),
    system: 'You are a helpful assistant.',
    messages: convertToCoreMessages(messages),
  });
  return result.toDataStreamResponse();

  // try {
  //     const response = await axios.post(
  //         'http://127.0.0.1:8000/api/chat', 
  //             {
  //               "user_id": "12345A",
  //               "session_id": "5aba3397-4356-43fc-85b6-9134f66c005f",
  //               "message": "Nutrients from Home Science"
  //             });
  //     const data = await response.data;
  //     console.log(data);
  //     const ans = {
  //       "role": "ai",
  //       "content": data.response.messages[data.response.messages.length -1].message
  //     };
  //     return new Response(JSON.stringify(ans));
  // } catch (error) {
  //   // Return a response with the error message for the client
  //   return new Response(JSON.stringify({ error: 'Failed to get answer' }), {
  //     status: 500,
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   });
  // }
}