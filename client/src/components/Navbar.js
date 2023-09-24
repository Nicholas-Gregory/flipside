export default function Navbar({ loggedIn, onClick }) {

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
                {loggedIn && <>
                    <li>
                        <button id='profile'>
                            My Profile
                        </button>
                    </li>
                    <li>
                        <button id='logout'>
                            Logout
                        </button>
                    </li>
                </>}
                {!loggedIn &&
                    <li>
                        <button id='auth'>
                            Sign In/Create Account
                        </button>
                    </li>    
                }
            </menu>
        </nav>
    )
}