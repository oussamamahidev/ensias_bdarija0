
module.exports = {
  compress: true,
  experimental: {
  },


  images:{
    remotePatterns:[
      {
        protocol: "https",
        hostname:'*'
      },
      {
        protocol: "http",
        hostname:'*'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
         {
          key: 'X-Accel-Buffering',
          value: 'no',
         },
       ],
     },
   ]
 },
};

