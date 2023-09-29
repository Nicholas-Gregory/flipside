import { useState } from "react"

export default function Remark({ remark }) {
    const [showComments, setShowComments] = useState(false);

    return (
        <>
            <p>
                {remark.body}
            </p>
            {!showComments ? 
                <button onClick={() => setShowComments(true)}>Show Comments</button>
                : 
                <button onClick={() => setShowComments(false)}>Hide Comments</button>
            }
        </>
    )
}