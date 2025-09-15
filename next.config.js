/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    TIDB_HOST: process.env.TIDB_HOST,
    TIDB_PORT: process.env.TIDB_PORT,
    TIDB_USER: process.env.TIDB_USER,
    TIDB_PASSWORD: process.env.TIDB_PASSWORD,
    TIDB_DATABASE: process.env.TIDB_DATABASE,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
    SLACK_CHANNEL_ID: process.env.SLACK_CHANNEL_ID,
  },
}

module.exports = nextConfig