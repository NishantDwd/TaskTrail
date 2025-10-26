import { useRef } from 'react'
import { FiX } from 'react-icons/fi'

export default function DraggableSidebar({ children, onClose }) {
  const sidebarRef = useRef(null)
  let startX = 0
  let startLeft = 0

  const handleMouseDown = (e) => {
    startX = e.clientX
    startLeft = sidebarRef.current.offsetLeft
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e) => {
    const dx = e.clientX - startX
    let newLeft = startLeft + dx
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 320))
    sidebarRef.current.style.left = `${newLeft}px`
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  return (
    <aside
      ref={sidebarRef}
      className="relative w-96 max-w-full h-full bg-white shadow-2xl border-l border-gray-200 flex flex-col z-50"
      style={{ left: 0, transition: 'left 0.2s' }}
    >
      {/* Drag handle */}
      <div
        className="absolute top-0 left-0 w-2 h-full cursor-ew-resize z-50"
        onMouseDown={handleMouseDown}
        style={{ background: 'rgba(0,0,0,0.02)' }}
        title="Drag"
      />
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-50"
        aria-label="Close"
      >
        <FiX className="w-6 h-6" />
      </button>
      <div className="overflow-y-auto h-full p-6 pt-12">{children}</div>
    </aside>
  )
}