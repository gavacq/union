'use client'
import { useFormStatus } from 'react-dom'
import LoadingSpinner from './LoadingSpinner'
export default function SubmitButton({ input, name }) {

  const { pending } = useFormStatus()

  const disabled = !input || pending
  return pending ? (
        <LoadingSpinner />
      ): <button className={`${!disabled ? 'bg-red1':'bg-gray1-dark'} text-black p-2 rounded text-bold border-black`} type="submit" disabled={disabled}>{name}</button>
}