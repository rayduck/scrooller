import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import Player from './Player'

function debounce(fn, ms = 100) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  }
}

export default function App (props) {
  // const theme = useTheme()
  const [scroll, setScroll] = useState({ x: window.scrollX || 0, y: window.scrollY || 0 })
  const [windowDimensions, setWindowDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
})

  // helper function to get scroll, via 2 methods
  const getScrollPosition = ({ element, useWindow }) => {
    const target = element ? element.current : document.body
    const position = target.getBoundingClientRect()

    return useWindow
      ? { x: window.scrollX, y: window.scrollY }
      : { x: position.left, y: position.top }
  }

  // useScrollHook
  // -Input:
  //    -effect: the function to be applied based on the current position and the old position
  //    -deps:
  //    -element: the element to get scroll position from, by default the window
  //    -useWindow: whether get position from window or not
  //    -wait: whether delay updating position or not
  // -
  const useScrollPosition = (effect, deps, element, useWindow=true, wait) => {
    const position = useRef(getScrollPosition({ useWindow }))

    let throttleTimeout = null

    const callBack = () => {
      const currPos = getScrollPosition({ element, useWindow })
      console.log("call back, window.scrollY, current, position", window.scrollY, currPos, position)
      effect({ prevPos: position.current, currPos })
      position.current = currPos
      throttleTimeout = null
    }

    useLayoutEffect(() => {
      const handleScroll = () => {
        if (wait) {
          if (throttleTimeout === null) {
            throttleTimeout = setTimeout(callBack, wait)
          }
        } else {
          callBack()
        }
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, deps)
  }

  // records scroll position for animations
  useScrollPosition(({ prevPos, currPos }) => {
    setScroll(currPos)
  }, [scroll])

  // Handles canvas resize re-render
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }
    window.addEventListener('resize', debounce(handleResize))
    return () => {
      window.removeEventListener('resize', debounce(handleResize))
    }
  })
  return (
	  <Player scroll={scroll.y} />
  )
}
