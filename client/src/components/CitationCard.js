export default function CitationCard({ citation, onClose }) {
    function handleXClick() {
        onClose(citation.id);
    }

    return (
        <div className="card">
            <button
                style={{
                    backgroundColor: "red",
                    float: 'right'
                }}
                onClick={handleXClick}
            >X</button>
            <p>
                "{citation.text}"
            </p>
            <p>
                {citation.body}
            </p>
            <a href={citation.link}>
                {citation.link}
            </a>
        </div>
    );
}