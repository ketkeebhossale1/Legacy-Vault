export default function AnimatedBlobs({ subtle = false }: { subtle?: boolean }) {
  const opacity = subtle ? 0.18 : 0.28
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div
        className="blob-1 absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          top: '-10%',
          left: '-8%',
          background: `radial-gradient(circle, rgba(26,143,143,${opacity + 0.06}) 0%, rgba(26,143,143,0) 70%)`,
          filter: 'blur(60px)',
        }}
      />
      <div
        className="blob-2 absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          bottom: '-5%',
          right: '-6%',
          background: `radial-gradient(circle, rgba(180,140,40,${opacity}) 0%, rgba(180,140,40,0) 70%)`,
          filter: 'blur(70px)',
        }}
      />
      <div
        className="blob-3 absolute rounded-full"
        style={{
          width: 420,
          height: 420,
          top: '40%',
          left: '50%',
          background: `radial-gradient(circle, rgba(60,120,180,${opacity - 0.05}) 0%, rgba(60,120,180,0) 70%)`,
          filter: 'blur(80px)',
        }}
      />
    </div>
  )
}
