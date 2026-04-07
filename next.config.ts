import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@dashboardpack/core"],
  turbopack: {},
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
