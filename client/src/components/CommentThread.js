export default function CommentThread({ comment, onLoadReplies }) {
    async function handleLoadRepliesClick() {

    }

    return (
        <>
            <p>
                {comment.body}
            </p>
            <button onClick={handleLoadRepliesClick}>View Replies</button>
        </>
    )
}