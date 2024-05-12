'use server';
import { redirect } from 'next/navigation'

export async function saveEmail(formData: FormData) {
  const rawFormData = {
    email: formData.get('email'),
  };
  await fetch('https://script.google.com/macros/s/AKfycbz2Myti3vmdq9VAEk2tMhQCt6bNnFXjTSfFgjwdpevkb8ZqVg4k1fK7ZdB4TbkNMmpz/exec', {
    method: 'POST',
    body: JSON.stringify(rawFormData),
  });

  redirect('/analyze')
}

export async function analyzeChatlog(formData: FormData) {
  const rawFormData = {
    chatlog: formData.get('chatlog'),
  };
  // post to localhost:9000/fixtures
  const apiUrl = process.env.NODE_ENV === 'production' ? 'https://whatsapp-analyzer-ejz2k5vlqq-uc.a.run.app/fixtures' : 'http://localhost:9000/fixtures';

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(rawFormData),
  });
  const data = await response.json();

  return data
}