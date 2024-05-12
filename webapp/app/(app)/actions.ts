'use server';
import { redirect } from 'next/navigation'

export async function saveEmail(formData: FormData) {
  const rawFormData = {
    email: formData.get('email'),
  };
  // Test it out:
  console.log(rawFormData);
  await fetch('https://script.google.com/macros/s/AKfycbz2Myti3vmdq9VAEk2tMhQCt6bNnFXjTSfFgjwdpevkb8ZqVg4k1fK7ZdB4TbkNMmpz/exec', {
    method: 'POST',
    body: JSON.stringify(rawFormData),
  });

  redirect('/upload')
}

export async function analyzeChatlog(formData: FormData) {
  const rawFormData = {
    chatlog: formData.get('chatlog'),
  };
  // Test it out:
  console.log(rawFormData);
  
  // wait for 5 s
  await new Promise((resolve) => setTimeout(resolve, 5000));

  redirect('/results')
}