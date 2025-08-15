// src/components/Section.jsx
export default function Section({ title, action, children }) {
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
