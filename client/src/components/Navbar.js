export default function Navbar({ onClick }) {

    function handleClick(e) {
        onClick(e.target.id);
    }

    return (
        <nav>
            <menu id="nav" onClick={handleClick}>
                <li>
                    <button id='browse'>
                        Browse Conversations
                    </button>
                </li>
                <li>
                    <button id='profile'>
                        My Profile
                    </button>
                </li>
                <li>
                    <button id='start'>
                        Start a Conversation
                    </button>
                </li>
                <li>
                    <button id='logout'>
                        Logout
                    </button>
                </li>
            </menu>
        </nav>
    )
}