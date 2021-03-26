import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export const ffmpegTranscodeFile = async (file, disposition=0) => {
  
  const ffmpeg = createFFmpeg({
    log: true,
  });
  
  console.log('Loading ffmpeg-core.js');
  await ffmpeg.load();
  console.log('Start transcoding');
  ffmpeg.FS('writeFile','output.mov', await fetchFile(file));
//   await ffmpeg.run('-i', 'output.mov' , '-c:a', 'aac', '-map', '0:a:0', 'newoutput.mov');
await ffmpeg.run('-i', 'output.mov' , '-c:v', 'copy', 'newoutput.mov');
  console.log('Complete transcoding');
  const data = ffmpeg.FS('readFile', 'newoutput.mov');
  const videoSrc = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mov' }));
//   await ffmpeg.run('-codecs');
//   ffmpeg.FS('unlink', 'output.mov');
  return videoSrc;
}
