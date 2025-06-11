import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configure webpack to handle Node.js modules
  webpack: (config, { isServer }) => {
    // If it's a client-side bundle, add fallbacks for Node.js modules
    if (!isServer) {
      // Create a more comprehensive list of Node.js modules to provide empty implementations for
      const nodeModules = [
        'fs', 'path', 'os', 'crypto', 'stream', 'http', 'https', 'zlib',
        'net', 'tls', 'dns', 'http2', 'util', 'url', 'querystring',
        'buffer', 'assert', 'events', 'child_process', 'worker_threads',
        'async_hooks', 'constants', 'module', 'process', 'readline',
        'string_decoder', 'timers', 'tty', 'dgram', 'vm', 'cluster',
        'console', 'perf_hooks', 'inspector', 'trace_events'
      ];
      
      // Add fallbacks for all Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ...nodeModules.reduce((acc, mod) => ({ ...acc, [mod]: false }), {}),
        '@opentelemetry/exporter-jaeger': false,
      };
      
      // Handle node: protocol imports
      const nodeProtocolModules: Record<string, boolean> = {};
      nodeModules.forEach(mod => {
        nodeProtocolModules[`node:${mod}`] = false;
      });
      
      config.resolve.alias = {
        ...config.resolve.alias,
        ...nodeProtocolModules,
      };
      
      // Ignore specific packages that are only used on the server
      config.externals = [
        ...(config.externals || []),
        function({ context, request }: { context: string; request: string }, callback: (err?: Error | null, result?: string) => void) {
          // List of packages that should only be used on the server
          const serverOnlyPackages = [
            'genkit',
            '@genkit-ai/googleai',
            '@genkit-ai/core',
            '@genkit-ai/ai',
            '@opentelemetry/sdk-node',
            '@opentelemetry/exporter-trace-otlp-grpc',
            '@grpc/grpc-js',
            'handlebars',
            'dotprompt',
            'server-only'
          ];
          
          // Check if the request is for a server-only package
          if (serverOnlyPackages.some(pkg => request.startsWith(pkg))) {
            // Return an empty module for client-side
            return callback(null, 'commonjs {}');
          }
          
          // Continue with the next external
          callback();
        }
      ];
    }
    
    return config;
  },
};

export default nextConfig;
