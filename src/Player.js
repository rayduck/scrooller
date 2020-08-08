import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import Canvas from './components/Canvas'

export default function Player({scroll}) {
	const [animScroll, setAnimScroll] = useState(0)
	const wrapRef = useRef(null)
  const [width, setWidth] = useState(0)
	const reqAnimationRef = useRef()
    const prevTimeRef = useRef()
	const numImages = 2000
	const videoImages = []

	useLayoutEffect(() => {
    setWidth(wrapRef.current.clientWidth)
  })

	for (let i = 1; i <= numImages; i++) {
    const img = new Image()
    img.src = require('../imgs/out' + i.padStart(4, '0') + '.jpg')
    videoImages.push(img)
	}

	  const animScrollUpdate = time => {
    if (prevTimeRef.current != undefined) {
      const deltaTime = time - prevTimeRef.current
    //using a ref to track values without re-render

    //throttle animation speed
    setAnimScroll(prevAScroll => {
        const currScroll = window.scrollY
        // const currScroll = scroll
        // console.log('prev ' + prevAScroll)
        // console.log('curr ' +currScroll)
        if (prevAScroll < currScroll) {
            return Math.min(Math.round(prevAScroll + deltaTime*1), currScroll)
        } else if (prevAScroll > currScroll) {
            return Math.max(Math.round(prevAScroll - deltaTime*1), currScroll)
        } else {
            return prevAScroll
        }
    })
    }

    prevTimeRef.current = time
    reqAnimationRef.current = requestAnimationFrame(animScrollUpdate)
 }

  useEffect(() => {
    reqAnimationRef.current = requestAnimationFrame(animScrollUpdate)
    return () => cancelAnimationFrame(reqAnimationRef.current)

  }, []/*To run once*/)

  return (
	  <div ref={wrapRef}>
<Canvas scroll={animScroll} images={videoImages} canvasWidth={width} />
    </div>
  );
}
