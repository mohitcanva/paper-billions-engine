/**
 * sync_durations.js
 * 
 * Automatically measures the duration of MP3 audio files referenced in public/storyboard.json
 * and synchronizes the durationInSeconds and durationInFrames for each scene.
 * 
 * Works using ffprobe (if available), ffmpeg, or fallback parsing.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = __dirname;
const STORYBOARD_PATH = path.join(PROJECT_ROOT, 'public', 'storyboard.json');
const AUDIO_DIR = path.join(PROJECT_ROOT, 'public', 'audio');

function getAudioDuration(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Audio file not found: ${filePath}`);
  }

  // 1. Try ffprobe (fastest, exact decimal seconds)
  try {
    const probeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`;
    const output = execSync(probeCmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    const duration = parseFloat(output);
    if (!isNaN(duration) && duration > 0) {
      return duration;
    }
  } catch (e) {
    // ffprobe failed or not installed, try ffmpeg
  }

  // 2. Try ffmpeg fallback
  try {
    const ffmpegCmd = `ffmpeg -i "${filePath}" 2>&1`;
    let output = '';
    try {
      execSync(ffmpegCmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (err) {
      output = err.output ? err.output.join('') : (err.message || '');
    }
    const match = output.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
    if (match) {
      const hours = parseFloat(match[1]);
      const minutes = parseFloat(match[2]);
      const seconds = parseFloat(match[3]);
      return hours * 3600 + minutes * 60 + seconds;
    }
  } catch (e) {
    // ffmpeg failed
  }

  // 3. Fallback: file size bitrate estimation for standard 128kbps MP3
  const stats = fs.statSync(filePath);
  const estimatedSeconds = (stats.size * 8) / (128 * 1000);
  console.warn(`[WARN] Using estimated duration for ${path.basename(filePath)}: ${estimatedSeconds.toFixed(2)}s`);
  return estimatedSeconds;
}

function syncDurations() {
  console.log('====================================================');
  console.log('  PAPER BILLIONS: Storyboard Audio Duration Sync    ');
  console.log('====================================================\n');

  if (!fs.existsSync(STORYBOARD_PATH)) {
    console.error(`Error: Storyboard file not found at ${STORYBOARD_PATH}`);
    process.exit(1);
  }

  const storyboardRaw = fs.readFileSync(STORYBOARD_PATH, 'utf-8');
  const storyboard = JSON.parse(storyboardRaw);

  const fps = storyboard.fps || 30;
  console.log(`Target FPS: ${fps}`);
  console.log(`Audio Directory: ${AUDIO_DIR}\n`);

  let totalFrames = 0;
  let totalSeconds = 0;

  const summary = [];

  storyboard.scenes = storyboard.scenes.map((scene, index) => {
    let durationSec = scene.durationInSeconds;

    if (scene.audioFile) {
      // Resolve path: supports "audio/file.mp3", "public/audio/file.mp3", or just "file.mp3"
      let audioPath = path.isAbsolute(scene.audioFile)
        ? scene.audioFile
        : path.join(PROJECT_ROOT, 'public', scene.audioFile.replace(/^\/?(public\/)?/, ''));

      if (!fs.existsSync(audioPath)) {
        // Try inside public/audio/
        const basename = path.basename(scene.audioFile);
        const fallbackPath = path.join(AUDIO_DIR, basename);
        if (fs.existsSync(fallbackPath)) {
          audioPath = fallbackPath;
        }
      }

      if (fs.existsSync(audioPath)) {
        try {
          durationSec = getAudioDuration(audioPath);
        } catch (err) {
          console.error(`Failed to measure duration for ${scene.audioFile}:`, err.message);
        }
      } else {
        console.warn(`[!] Audio file referenced does not exist: ${scene.audioFile}`);
      }
    }

    // Add minimal pad or buffer if desired (e.g. at least 1s)
    durationSec = Math.max(1, durationSec || 3);
    const durationFrames = Math.round(durationSec * fps);

    scene.durationInSeconds = parseFloat(durationSec.toFixed(2));
    scene.durationInFrames = durationFrames;

    totalFrames += durationFrames;
    totalSeconds += scene.durationInSeconds;

    summary.push({
      Index: index + 1,
      ID: scene.id,
      Type: scene.type,
      Audio: scene.audioFile ? path.basename(scene.audioFile) : '(none)',
      Seconds: `${scene.durationInSeconds}s`,
      Frames: durationFrames,
    });

    return scene;
  });

  storyboard.totalDurationInSeconds = parseFloat(totalSeconds.toFixed(2));
  storyboard.totalDurationInFrames = totalFrames;
  storyboard.updatedAt = new Date().toISOString();

  fs.writeFileSync(STORYBOARD_PATH, JSON.stringify(storyboard, null, 2), 'utf-8');

  console.table(summary);
  console.log(`\n Total Scenes: ${storyboard.scenes.length}`);
  console.log(` Total Video Duration: ${totalSeconds.toFixed(2)}s (${totalFrames} frames @ ${fps}fps)`);
  console.log(` Updated ${STORYBOARD_PATH} successfully!\n`);
}

syncDurations();
