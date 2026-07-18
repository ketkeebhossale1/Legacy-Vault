import { useState, useRef, useEffect, useCallback } from 'react'
import { Pencil, StickyNote, Trash2, RotateCcw, Download, Users, Move } from 'lucide-react'

interface Point { x: number; y: number }
interface Stroke { points: Point[]; color: string; width: number }
interface StickyNoteData { id: string; x: number; y: number; text: string; color: string }

const STICKY_COLORS = ['#fff9c4', '#c8f7c5', '#d6eaf8', '#fce4ec', '#f3e5f5']
const COLORS = ['#1a8f8f', '#d4a72c', '#e53935', '#2e7d32', '#1565c0', '#6a1b9a', '#212529']

const mockCollaborators = [
  { name: 'Priya S.', color: '#1a8f8f', active: true },
  { name: 'Arjun S.', color: '#d4a72c', active: false },
]

export default function CollaborationSpace() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<'draw' | 'sticky' | 'move'>('draw')
  const [color, setColor] = useState('#1a8f8f')
  const [lineWidth, setLineWidth] = useState(3)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [currentStroke, setCurrentStroke] = useState<Point[]>([])
  const [stickies, setStickies] = useState<StickyNoteData[]>([
    { id: 's1', x: 120, y: 80, text: 'Remember to update crypto wallet info!', color: '#fff9c4' },
    { id: 's2', x: 380, y: 160, text: 'Priya: Check if LIC nominee is still correct.', color: '#c8f7c5' },
    { id: 's3', x: 620, y: 90, text: 'Arjun: I confirmed my key share receipt ✓', color: '#d6eaf8' },
  ])
  const [dragging, setDragging] = useState<{ id: string; offX: number; offY: number } | null>(null)
  const [editingSticky, setEditingSticky] = useState<string | null>(null)
  const [stickyColorIdx, setStickyColorIdx] = useState(0)

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const stroke of strokes) {
      if (stroke.points.length < 2) continue
      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      ctx.stroke()
    }
    if (currentStroke.length > 1) {
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y)
      for (let i = 1; i < currentStroke.length; i++) ctx.lineTo(currentStroke[i].x, currentStroke[i].y)
      ctx.stroke()
    }
  }, [strokes, currentStroke, color, lineWidth])

  useEffect(() => { redraw() }, [redraw])

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'draw') {
      setIsDrawing(true)
      setCurrentStroke([getPos(e)])
    } else if (tool === 'sticky') {
      const pos = getPos(e)
      const newSticky: StickyNoteData = { id: 's' + Date.now(), x: pos.x - 80, y: pos.y - 40, text: 'New note...', color: STICKY_COLORS[stickyColorIdx] }
      setStickies(prev => [...prev, newSticky])
      setEditingSticky(newSticky.id)
      setStickyColorIdx(i => (i + 1) % STICKY_COLORS.length)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'draw' && isDrawing) setCurrentStroke(prev => [...prev, getPos(e)])
  }

  const handleMouseUp = () => {
    if (tool === 'draw' && isDrawing) {
      setStrokes(prev => [...prev, { points: currentStroke, color, width: lineWidth }])
      setCurrentStroke([])
      setIsDrawing(false)
    }
  }

  const undo = () => setStrokes(prev => prev.slice(0, -1))
  const clear = () => { setStrokes([]); setStickies([]) }

  const exportCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.download = 'collaboration-board.png'
    a.href = canvas.toDataURL()
    a.click()
  }

  const handleStickyMouseDown = (e: React.MouseEvent, id: string) => {
    if (tool !== 'move') return
    e.stopPropagation()
    const sticky = stickies.find(s => s.id === id)!
    setDragging({ id, offX: e.clientX - sticky.x, offY: e.clientY - sticky.y })
  }

  const handleBoardMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setStickies(prev => prev.map(s => s.id === dragging.id ? { ...s, x: e.clientX - dragging.offX, y: e.clientY - dragging.offY } : s))
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Collaboration Space</h1>
          <p className="text-slate-500 text-sm mt-1">A shared board for family notes, drawings, and memory keeping.</p>
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} style={{ color: '#1a8f8f' }} />
          {mockCollaborators.map(c => (
            <div key={c.name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.8)', border: `1.5px solid ${c.color}`, color: c.color }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.active ? c.color : '#adb5bd' }} />
              {c.name}
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(26,143,143,0.1)', backdropFilter: 'blur(12px)' }}>
        <div className="flex gap-1">
          {([['draw', <Pencil size={15} />, 'Draw'], ['sticky', <StickyNote size={15} />, 'Sticky'], ['move', <Move size={15} />, 'Move']] as const).map(([t, icon, label]) => (
            <button key={t} onClick={() => setTool(t as typeof tool)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={tool === t ? { background: '#1a8f8f', color: 'white' } : { color: '#495057', background: 'rgba(0,0,0,0.04)' }}>
              {icon} {label}
            </button>
          ))}
        </div>

        <div className="w-px h-6" style={{ background: '#dee2e6' }} />

        <div className="flex items-center gap-1.5">
          {COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)}
              className="w-5 h-5 rounded-full transition-all"
              style={{ background: c, border: color === c ? '2.5px solid white' : '2px solid transparent', boxShadow: color === c ? `0 0 0 2px ${c}` : 'none' }} />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Width</span>
          <input type="range" min={1} max={12} value={lineWidth} onChange={e => setLineWidth(+e.target.value)} className="w-20 accent-teal-600" />
        </div>

        <div className="ml-auto flex gap-2">
          <button onClick={undo} className="p-2 rounded-lg transition-all hover:bg-slate-100" title="Undo"><RotateCcw size={15} style={{ color: '#6c757d' }} /></button>
          <button onClick={exportCanvas} className="p-2 rounded-lg transition-all hover:bg-slate-100" title="Download"><Download size={15} style={{ color: '#6c757d' }} /></button>
          <button onClick={clear} className="p-2 rounded-lg transition-all hover:bg-red-50" title="Clear all"><Trash2 size={15} style={{ color: '#dc3545' }} /></button>
        </div>
      </div>

      {/* Board */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ height: 500, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(26,143,143,0.12)', backdropFilter: 'blur(8px)', backgroundImage: 'radial-gradient(circle, rgba(26,143,143,0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        onMouseMove={handleBoardMouseMove}
        onMouseUp={() => setDragging(null)}
      >
        <canvas
          ref={canvasRef}
          width={900}
          height={500}
          className="absolute inset-0 w-full h-full"
          style={{ cursor: tool === 'draw' ? 'crosshair' : tool === 'sticky' ? 'cell' : 'default' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* Sticky notes */}
        {stickies.map(sticky => (
          <div
            key={sticky.id}
            className="absolute select-none"
            style={{ left: sticky.x, top: sticky.y, cursor: tool === 'move' ? 'grab' : 'default', zIndex: 10 }}
            onMouseDown={e => handleStickyMouseDown(e, sticky.id)}
          >
            <div className="w-44 min-h-[80px] rounded-xl shadow-lg p-3 flex flex-col gap-1" style={{ background: sticky.color, border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-1">
                <StickyNote size={11} style={{ color: 'rgba(0,0,0,0.35)' }} />
                <button onClick={() => setStickies(prev => prev.filter(s => s.id !== sticky.id))} className="opacity-40 hover:opacity-80 transition-opacity">
                  <Trash2 size={11} />
                </button>
              </div>
              {editingSticky === sticky.id ? (
                <textarea
                  autoFocus
                  value={sticky.text}
                  onChange={e => setStickies(prev => prev.map(s => s.id === sticky.id ? { ...s, text: e.target.value } : s))}
                  onBlur={() => setEditingSticky(null)}
                  className="text-xs text-slate-700 bg-transparent outline-none resize-none w-full"
                  rows={3}
                />
              ) : (
                <p className="text-xs text-slate-700 cursor-text leading-relaxed" onClick={() => setEditingSticky(sticky.id)}>{sticky.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-400 text-center">
        In production, strokes and sticky notes sync in real time across all nominees via WebSockets. This demo is local.
      </p>
    </div>
  )
}
