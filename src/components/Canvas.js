import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import CanvasBase from './CanvasBase'

// Draw canvas based on scroll
export default function Canvas(props) {
  const { scroll, top, keyFrame, images } = props
  const { animationStart, animationEnd } = keyFrame
  const [imageToDraw, setImageToDraw] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight)
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth)

  const numFrames = animationEnd - animationStart
  const numImages = images.length
  const currentImage = Math.round(numImages * (scroll - animationStart) / numFrames)

  useLayoutEffect(() => {
    if (scroll <= animationStart) {
      setImageToDraw(0)
    } else if (scroll > animationStart && scroll <= animationEnd) {
      setImageToDraw(currentImage)
    } else {
      setImageToDraw(numImages - 1)
    }
  })

  useLayoutEffect(() => {
    setCanvasHeight(window.innerHeight)
    setCanvasWidth(window.innerWidth)
  })

  return (
    <div
      className='image-sequence'
      style={{ position: 'absolute', top: '0', height: '100%' }}
    >
      <CanvasBase image={images[imageToDraw]} canvasWidth={canvasWidth} canvasHeight={canvasHeight} canvasId='test-canvas' />
    </div>
  )
}
