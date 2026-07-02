export default function SearchBar({value,onSearch,onClear}) {
  return (
    <div className="search-bar">
      <input value={value} onChange={e=>onSearch(e.target.value)} placeholder="Search image number"/>
      <button onClick={onClear}>Clear</button>
    </div>
  );
}
