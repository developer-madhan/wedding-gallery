export default function LoadingSkeleton({count=12}) {
  return <div className="gallery">{Array.from({length:count},(_,i)=><div key={i} className="image-skeleton"/>)}</div>;
}
