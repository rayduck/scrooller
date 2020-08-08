import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'

// Draw canvas based on image, given width and height of the canvas
export default function CanvasBase(props) {
  const { image, canvasWidth, canvasHeight, canvasId } = props
  const canvasRef = useRef(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (image) {
      // gives centered coordinates and scale image
      const autoScale = Math.min(canvasWidth / image.width, canvasHeight / image.height)
      const fitWidthScale = canvasWidth / image.width
      const scale = fitWidthScale
      const scaledWidth = image.width * scale
      const scaledHeight = image.height * scale
      const drawX = (canvasWidth - scaledWidth) / 2
      // with 96 offset to account for top
      const drawY = (canvasHeight - scaledHeight) / 2 + 96

      if (image.complete) {
        ctx.drawImage(image, drawX, drawY, scaledWidth, scaledHeight)
      } else {
        image.onload = () => {
          ctx.drawImage(image, drawX, drawY, scaledWidth, scaledHeight)
        }
      }
    }

  })

  return (
    <div style={{ position: 'sticky', top: '0' }}>
      <canvas
        id={canvasId}
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      />
  </div>
  )
}
