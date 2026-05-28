import AppRouter from './routes/AppRouter';
import { AuthProvider } from './auth/auth.context';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}