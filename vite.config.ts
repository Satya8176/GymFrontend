import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',              // allows external access (needed for ngrok)
    port: 5173,
    allowedHosts: ['.ngrok-free.app'], // ✅ allows any ngrok subdomain
    hmr: {
      clientPort: 443,           // ensures HMR works over HTTPS
      protocol: 'wss',           // secure websocket for ngrok
    },
  },
});



// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     hmr: {
//       protocol: 'ws',
//       host: 'localhost',
//     }
//   },
// });

// // server: {
// //     host: '0.0.0.0', 
// //     port: 5173,
// //     hmr: {
// //         clientPort: 443,
// //         protocol: 'wss',
// //     },
// //   },
