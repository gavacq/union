import Link from 'next/link';
import LoginButton from './LoginButton';

export default function Page() {
  return (
    <div className="flex flex-col items-center grow text-lunar-green-300">
      <div className="flex flex-col items-center justify-center w-4/5 mt-40">
        <div className="flex flex-col">
          <h1 className="mb-4 text-2xl font-bold">
            Welcome to Integrity Check!
          </h1>
          <p className="text-md mb-8">
            Quantify and analyze your personal growth through daily integrity
            ratings
          </p>
          <LoginButton />
        </div>
      </div>
      <div className="w-4/5 absolute bottom-10">
        <p className="text-left text-lg text-gray-500 font-light">
          <strong>Integrity</strong> | /ɪnˈtɛɡrɪti/ <br />
          noun <br />
          {`The quality or state of being in alignment with one's values and
          principles.`}
          <br />
        </p>
      </div>
    </div>
  );
}
