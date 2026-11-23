/**
 * sync_durations.js
 * 
 * Automatically measures the duration of the continuous narration audio
 * (public/audio/full_voiceover.mp3) and synchronizes storyboard.json:
 * 
 * 1. Measures full_voiceover.mp3 duration and sets total composition duration
 * 2. Calculates each scene's durationInFrames from (end_time - start_time) at target FPS (30 fps)
 * 3. Updates public/storyboard.json and displays a formatted scene timeline table
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
    // ffprobe failed or not installed, fallback to ffmpeg
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
  console.log('  PAPER BILLIONS: Continuous Audio Timeline Sync    ');
  console.log('====================================================\n');

  if (!fs.existsSync(STORYBOARD_PATH)) {
    console.error(`Error: Storyboard file not found at ${STORYBOARD_PATH}`);
    process.exit(1);
  }

  const storyboardRaw = fs.readFileSync(STORYBOARD_PATH, 'utf-8');
  const storyboard = JSON.parse(storyboardRaw);

  const fps = storyboard.fps || 30;
  console.log(`Target FPS: ${fps}`);

  // 1. Resolve continuous narration audio file
  const audioRel = storyboard.audioFile || 'audio/full_voiceover.mp3';
  let fullAudioPath = path.join(PROJECT_ROOT, 'public', audioRel.replace(/^\/?(public\/)?/, ''));

  if (!fs.existsSync(fullAudioPath)) {
    const fallbackPath = path.join(AUDIO_DIR, 'full_voiceover.mp3');
    if (fs.existsSync(fallbackPath)) {
      fullAudioPath = fallbackPath;
    }
  }

  let totalAudioSeconds = 0;
  let totalAudioFrames = 0;

  if (fs.existsSync(fullAudioPath)) {
    totalAudioSeconds = getAudioDuration(fullAudioPath);
    totalAudioFrames = Math.round(totalAudioSeconds * fps);
    console.log(`Continuous Audio File: ${path.basename(fullAudioPath)}`);
    console.log(`Measured Audio Duration: ${totalAudioSeconds.toFixed(2)}s (${totalAudioFrames} frames @ ${fps}fps)\n`);
  } else {
    console.warn(`[!] Narration audio file not found at: ${fullAudioPath}`);
    console.warn('    Using sum of scene durations as fallback.\n');
  }

  let accumulatedTime = 0;
  let accumulatedFrames = 0;
  const summary = [];

  storyboard.scenes = storyboard.scenes.map((scene, index) => {
    // Ensure start_time and end_time exist
    let start = scene.start_time !== undefined ? parseFloat(scene.start_time) : accumulatedTime;
    let end = scene.end_time !== undefined ? parseFloat(scene.end_time) : start + (scene.durationInSeconds || 3);

    // If this is the last scene and we measured the full audio, ensure it spans to the end
    if (index === storyboard.scenes.length - 1 && totalAudioSeconds > 0 && end < totalAudioSeconds) {
      end = parseFloat(totalAudioSeconds.toFixed(2));
    }

    const durationSec = Math.max(0.1, end - start);
    const durationFrames = Math.round(durationSec * fps);
    const startFrame = Math.round(start * fps);

    scene.start_time = parseFloat(start.toFixed(2));
    scene.end_time = parseFloat(end.toFixed(2));
    scene.durationInSeconds = parseFloat(durationSec.toFixed(2));
    scene.durationInFrames = durationFrames;

    summary.push({
      Index: index + 1,
      ID: scene.id,
      Type: scene.type,
      'Start (s)': `${scene.start_time}s`,
      'End (s)': `${scene.end_time}s`,
      'Duration (s)': `${scene.durationInSeconds}s`,
      'Frames': durationFrames,
      'Start Frame': startFrame,
    });

    accumulatedTime = end;
    accumulatedFrames += durationFrames;

    return scene;
  });

  // Set total composition duration to length of full_voiceover.mp3 (or sum of scenes)
  const finalTotalSeconds = totalAudioSeconds > 0 ? totalAudioSeconds : accumulatedTime;
  const finalTotalFrames = totalAudioFrames > 0 ? totalAudioFrames : accumulatedFrames;

  storyboard.totalDurationInSeconds = parseFloat(finalTotalSeconds.toFixed(2));
  storyboard.totalDurationInFrames = finalTotalFrames;
  storyboard.audioFile = audioRel;
  storyboard.updatedAt = new Date().toISOString();

  fs.writeFileSync(STORYBOARD_PATH, JSON.stringify(storyboard, null, 2), 'utf-8');

  console.table(summary);
  console.log(`\n Total Scenes: ${storyboard.scenes.length}`);
  console.log(` Total Video Duration: ${storyboard.totalDurationInSeconds}s (${storyboard.totalDurationInFrames} frames @ ${fps}fps)`);
  console.log(` Updated ${STORYBOARD_PATH} successfully!\n`);
}

syncDurations();
