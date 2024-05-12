'use server';
import { redirect } from 'next/navigation'
import fs from 'fs/promises';

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

export async function analyzeChatlog(formData: FormData, demo: boolean) {
  const apiUrl = process.env.NODE_ENV === 'production' ? 'https://whatsapp-analyzer-ejz2k5vlqq-uc.a.run.app/upload-zip' : 'http://localhost:9000/upload-zip';


  let response;
  if (demo) {
    const demoFileBuffer = await fs.readFile(process.cwd() + '/app/demoSample.txt', 'utf8');
    const demoFileBlob = new Blob([demoFileBuffer], { type: 'text/plain' });
    const demoFormData = new FormData();
    demoFormData.append('file', demoFileBlob, 'data.json');

    response = await fetch(apiUrl, {
      method: 'POST',
      body: demoFormData,
    });
  } else {
    response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });
  }

  const json = await response.json();

  const data = json.data.map((chatlog) => {
    const parsed = JSON.parse(chatlog)
    return Object.values(parsed)
  })

  return {
    data,
    plots: json.plots,
  }
}