import { Config } from "@remotion/cli/config";

// Termux / headless chromium configuration options
Config.setChromiumOpenGlRenderer("angle");
Config.setCodec("h264");
Config.setConcurrency(1);
