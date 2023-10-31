import '../../globals.css';
import SignupForm from '../../components/SignupForm';

export default function Signup() {
  return (
    <main className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto bg-white rounded shadow p-4">
        <div className="siteContainer flex items-center justify-center">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
