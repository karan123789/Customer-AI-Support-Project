"use client";
import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant', 
      content: 'Hi! I am the Headstarter Support Assistant! How can I help you?'
    },
  ]);

  const sendMessage = async () => {
    setMessage('');
    setMessages((messages) => [
      ...messages, 
      { role: 'user', content: message },
      { role: 'assistant', content: '' }
    ]);

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      return reader.read().then(function processText({ done, value }) {
        if (done) return result;
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages, 
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  const [message, setMessage] = useState('');
  
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="linear-gradient(to right, #4a90e2, #50e3c2)"
      sx={{ p: 3 }}
    >
      <Typography 
        variant="h4"
        component="h1"
        color="white"
        fontWeight="bold"
        mb={3}
        sx={{ textAlign: 'center', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
      >
        Headstarter AI Assistant
      </Typography>
      
      <Stack 
        direction="column" 
        width="100%"
        maxWidth="600px"
        height="80%"
        border="1px solid"
        borderColor="divider"
        borderRadius="16px"
        bgcolor="background.paper"
        boxShadow={3}
        p={2}
        spacing={3}
        sx={{ overflow: 'hidden' }}
      >
        <Stack 
          direction="column" 
          spacing={2} 
          flexGrow={1} 
          overflow="auto"
          maxHeight="100%"
          sx={{ p: 2 }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
              sx={{ mb: 1 }}
            >
              <Box
                bgcolor={
                  message.role === 'assistant' 
                    ? 'primary.main' 
                    : 'secondary.main'
                }
                color="white"
                borderRadius="16px"
                p={2}
                maxWidth="80%"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField 
            label="Message" 
            fullWidth 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            sx={{ borderRadius: '8px', bgcolor: 'background.default' }}
          />
          <Button 
            variant="contained" 
            onClick={sendMessage}
            sx={{ borderRadius: '8px' }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
