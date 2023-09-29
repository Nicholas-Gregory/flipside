export default function CommentList({ comments }) {
    return (
        <>
            <ul>
                {comments.map(comment =>
                    <li key={comment.id}>
                        <Comment comment={comment} />
                    </li>    
                )}
            </ul>
        </>
    )
}