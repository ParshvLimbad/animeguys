
export default function AdSlot({ label = "Ad" }){
  return (
    <div className="my-6 w-full flex items-center justify-center">
      <div className="w-full max-w-[970px] h-[90px] bg-neutral-900 border border-neutral-800 rounded-xl grid place-items-center">
        <span className="text-neutral-500">{label} placeholder</span>
      </div>
    </div>
  );
}
