export default function CitationCard({ citation }) {
    return (
        <div className="card">
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