import { useEffect, useRef } from "react"

import { animate } from "../../../utils/animate"

const hoverArrow = (arrow: SVGElement) => {
  const states = animate.states({
    shared: { opacity: 1 },
    down: { translate: "0 0" },
    up: { translate: "0 -15%" },
  })

  let anim = animate([[arrow, states.down]])

  const hover = () => {
    anim = animate(
      [
        [arrow, states.up, { duration: 300, ease: "inOut" }],
        [arrow, states.down, { duration: 300, ease: "inOut" }],
      ],
      "loop"
    )
  }

  void hover()

  return () => {
    anim.cancel()
    void animate([[arrow, states.down]])
  }
}

const fadeStates = animate.states({
  shared: { transformOrigin: "center" },
  in: { opacity: 0, scale: "150%" },
  visible: { opacity: 1, scale: "100%" },
  out: { opacity: 0, scale: "50%" },
  reset: { scale: "100%" },
})
const fadeOut = (item: SVGElement) =>
  animate([
    [item, fadeStates.visible],
    [item, fadeStates.out, { duration: 500, ease: "out" }],
    [item, { scale: "100%" }],
  ])

const replace = (prev: SVGElement, next: SVGElement) =>
  animate([
    [prev, fadeStates.visible],
    [next, fadeStates.in],
    [prev, fadeStates.out, { duration: 300, ease: "out" }],
    [next, fadeStates.visible, { at: 150, duration: 300, ease: "out" }],
    [prev, fadeStates.reset],
  ])

const wiggle = (item: SVGElement, repeat: "once" | "loop") => {
  const states = animate.states({
    shared: { transformOrigin: "center", translate: "0%" },
    tiltLeft: { rotate: "-5deg", translate: "-2%" },
    tiltRight: { rotate: "5deg", translate: "2%" },
    reset: { rotate: "0deg" },
  })

  let anim = animate([[item, states.reset]])
  let canceled = false
  const wiggle = () => {
    if (canceled) return
    anim = animate(
      [
        [item, states.tiltLeft, { duration: 100, ease: "out" }],
        [item, states.tiltRight, { duration: 200, ease: "linear" }],
        [item, states.tiltLeft, { duration: 200, ease: "linear" }],
        [item, states.tiltRight, { duration: 200, ease: "linear" }],
        [item, states.reset, { duration: 100, ease: "out" }],
      ],
      repeat
    )
  }

  void wiggle()

  return () => {
    canceled = true
    anim.cancel()
    void animate([[item, states.reset]])
  }
}

const translateTopOut = (item: SVGElement) =>
  animate([
    [item, { translate: "0", opacity: 1 }],
    [item, { translate: "0 -100%" }, { duration: 300, ease: "out" }],
    [item, { opacity: 0 }, { at: 150, duration: 150, ease: "out" }],
    [item, { translate: "0", opacity: 0 }],
  ])

type IconStatus = "idle" | "invalid" | "valid" | "accepted"

export const UploadIcon = ({ status }: { status: IconStatus }) => {
  const arrowRef = useRef<SVGGElement>(null)
  const bucketRef = useRef<SVGGElement>(null)
  const xRef = useRef<SVGGElement>(null)
  const checkRef = useRef<SVGGElement>(null)

  const visibleIcon = useRef<SVGGElement>(null)

  useEffect(() => {
    const arrow = arrowRef.current
    if (!arrow || status !== "valid") return

    const cancel = hoverArrow(arrow)
    visibleIcon.current = arrow
    return () => cancel()
  }, [status])

  useEffect(() => {
    const arrow = arrowRef.current
    const x = xRef.current
    if (!x || !arrow || status !== "invalid") return

    const anim = replace(visibleIcon.current ?? arrow, x)
    visibleIcon.current = x
    const cancelWiggle = wiggle(x, "loop")

    return () => {
      void anim.then(() => {
        cancelWiggle()
        visibleIcon.current = arrow
        void replace(x, arrow)
      })
    }
  }, [status])

  useEffect(() => {
    const arrow = arrowRef.current
    const check = checkRef.current
    if (!check || !arrow || status !== "accepted") return

    const promise = Promise.all([translateTopOut(arrow), replace(arrow, check)])
    visibleIcon.current = check
    void promise.then(() => {
      wiggle(check, "once")
    })

    return () => {
      void promise.then(() => {
        void fadeOut(check)
      })
    }
  }, [status])

  const x = (
    <g ref={xRef} className="origin-center stroke-alert-error opacity-0">
      <path d="M8 5 16 13" />
      <path d="M16 5 8 13" />
    </g>
  )
  const check = (
    <g ref={checkRef} className="origin-center stroke-alert-success opacity-0">
      <path d="M7 9 11 13 19 6" />
    </g>
  )
  const arrow = (
    <g ref={arrowRef} className="origin-center stroke-text opacity-100">
      <path d="M12 3v12" />
      <path d="m17 8 -5 -5 -5 5" />
    </g>
  )
  const bucket = (
    <g ref={bucketRef} className="stroke-text">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    </g>
  )

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="overflow-visible"
    >
      {x}
      {check}
      {arrow}
      {bucket}
    </svg>
  )
}
