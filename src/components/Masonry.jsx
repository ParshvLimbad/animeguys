// src/components/Masonry.jsx
export default function Masonry({ children, minCol = 220 }) {
  return (
    <div className="masonry" style={{ columnWidth: `${minCol}px` }}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div key={i} className="break-inside-avoid mb-4">
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
