import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default {
  base: '/Descriptive-Statistics-Confidence-Interval-Analyzer/',
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/Descriptive-Statistics-Confidence-Interval-Analyzer/',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
