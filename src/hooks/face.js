// utils/faceDetection.js
'use client'
import * as faceapi from 'face-api.js';

export async function detectFaces(imageElement) {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  const result = await faceapi.detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions());
  return result;
}
