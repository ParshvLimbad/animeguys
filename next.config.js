/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove any old experimental flags like `appDir`
  // experimental: { appDir: true }, // ❌ delete if you still have this

  webpack: (config) => {
    // Map removed internal paths (used by older libs) to the current ones
    const alias = config.resolve.alias || (config.resolve.alias = {});

    alias["next/dist/server/future/route-modules/pages/module.compiled"] =
      "next/dist/server/route-modules/pages/module";

    alias["next/dist/server/future/route-modules/pages/module"] =
      "next/dist/server/route-modules/pages/module";

    alias["next/dist/server/future/route-modules/app-page/module.compiled"] =
      "next/dist/server/route-modules/app-page/module";

    alias["next/dist/server/future/route-modules/app-route/module.compiled"] =
      "next/dist/server/route-modules/app-route/module";

    return config;
  },
};

module.exports = nextConfig;
