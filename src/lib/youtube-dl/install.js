const debug = require("debug")("youka:youtube-dl");
const os = require("os");
const fs = require("fs");
const rp = require("request-promise");
const platform = os.platform();
const YOUTUBE_DL_PATH = require("./").YOUTUBE_DL_PATH;

const urls = {
  win32: "https://yt-dl.org/downloads/latest/youtube-dl.exe",
  darwin: "https://yt-dl.org/downloads/latest/youtube-dl",
  linux: "https://yt-dl.org/downloads/latest/youtube-dl",
};

async function exists(filepath) {
  try {
    await fs.promises.stat(filepath);
    return true;
  } catch (e) {
    return false;
  }
}

async function shouldInstall() {
  const ex = await exists(YOUTUBE_DL_PATH);
  if (!ex) return true;
  return false;
}

async function install() {
  try {
    if (!(await shouldInstall())) return;
    const url = urls[platform];
    if (!url) throw new Error("unsupported platform");
    debug("install youtube-dl");
    const ytdl = await rp({ url, encoding: null });
    await fs.promises.writeFile(YOUTUBE_DL_PATH, ytdl);
    await fs.promises.chmod(YOUTUBE_DL_PATH, "755");
  } catch (e) {
    throw new Error("Install youtube-dl failed");
  }
}

module.exports = install;