import Comment from './Comment';

export default function CommentList({ comments, remarkId }) {
    return (
        <>
            <ul className='commentList'>
                {comments.map(comment =>
                    <li key={comment.id} className='commentLi'>
                        <Comment comment={comment} remarkId={remarkId} />
                    </li>    
                )}
            </ul>
        </>
    )
}