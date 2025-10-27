import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ✅ Proper ESM export
export default defineConfig({
  plugins: [react()],
});
