import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['.ngrok-free.app'],
    hmr: {
      clientPort: 5173,  // use your actual dev port
      protocol: 'ws',    // normal websocket, not secure
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
