export default function GalleryHeader({ title, loaded, total }) {
    return (
        <header className="gallery-header">
            <h1>{title}</h1>
            <p>
                Showing {loaded} of {total} Photos
            </p>
        </header>
    );
}