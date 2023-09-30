import Comment from './Comment';

export default function CommentList({ comments, remarkId }) {
    return (
        <>
            <ul>
                {comments.map(comment =>
                    <li key={comment.id}>
                        <Comment comment={comment} remarkId={remarkId} />
                    </li>    
                )}
            </ul>
        </>
    )
}